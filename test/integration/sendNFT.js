// Load dependencies
const { expect } = require("chai");
const { setupDAO } = require("../../scripts/DAOStack/setupDAO");
const constants = require("../../scripts/DAOStack/constants");
const Web3 = require("web3");
const getValueFromLogs = require("../../scripts/helpers/getValueFromLogs");

// Load compiled artifacts
const NFTManager = artifacts.require("NFTManagerUpgradeSafe");
const NFTMock = artifacts.require("NFTMock");

const NFTMockParams = {
  name: "Mock",
  symbol: "MK",
  baseURI: "/",
};

const encodeSendNFTCall = (recipient, nftContract, tokenId) => {
  const sendNFTAbi = NFTManager.abi.find((func) => func.name === "sendNFT");

  return NFTManager.web3.eth.abi.encodeFunctionCall(
    {
      name: sendNFTAbi.name,
      type: sendNFTAbi.type,
      inputs: sendNFTAbi.inputs,
    },
    [recipient, nftContract, tokenId]
  );
};

// Start test block
contract("NFTManager", (accounts) => {
  console.log(accounts);
  const [owner, nftMinter, nftSender, nftRecipient] = accounts;
  let nftMock;
  let nftManager;
  let dao;

  beforeEach(async () => {
    // Create NFT
    nftMock = await NFTMock.new({ from: nftMinter });
    await nftMock.initialize(
      NFTMockParams.name,
      NFTMockParams.symbol,
      NFTMockParams.baseURI,
      { from: nftMinter }
    );

    await nftMock.mint(owner, { from: nftMinter });
    await nftMock.mint(nftSender, { from: nftMinter });

    // Create NFTManager
    nftManager = await NFTManager.new({ from: owner });
    await nftManager.initialize({ from: owner });

    // Create DAO
    dao = await setupDAO(accounts, nftManager.address);
    console.log(dao.avatar.address);

    // Transfer NFTManager for DAO Ownership
    await nftManager.transferOwnership(dao.avatar.address, { from: owner });
  });

  // Test case

  it("NFT Manager is owned by DAO Avatar", async function() {
    const owner = await nftManager.owner();
    expect(owner).to.be.eq(dao.avatar.address);
  });

  it("Valid NFT transfer succeeds when sent by owner", async function() {
    const tokenId = 0;

    // Gift NFT to NFTManager
    await nftMock.transferFrom(owner, nftManager.address, tokenId, {
      from: owner,
    });

    // Create proposal from owner
    const call = encodeSendNFTCall(nftRecipient, nftMock.address, tokenId);
    let tx = await dao.genericScheme.proposeCall(call, 0, constants.NULL_HASH, {
      from: owner,
    });

    // Get proposal ID
    const proposalId = await getValueFromLogs(tx, "_proposalId");
    console.log("proposalId", proposalId);

    // Gather sufficient votes + Execute Proposal
    await dao.genericSchemeParams.votingMachine.absoluteVote.vote(
      proposalId,
      1,
      0,
      constants.NULL_ADDRESS,
      { from: owner }
    );

    // Verify it's success (the NFT is owned by nftRecipient)
    const expectedOwner = await nftMock.ownerOf(tokenId);
    expect(nftRecipient).to.be.eq(expectedOwner);
  });

  it("Valid NFT transfer fails when sent by non-owner", async function() {
    const tokenId = 0;

    // Gift NFT to NFTManager
    await nftMock.transferFrom(owner, nftManager.address, tokenId, {
      from: owner,
    });

    // Create proposal from owner
    const call = encodeSendNFTCall(nftRecipient, nftMock.address, tokenId);
    let tx = await dao.genericScheme.proposeCall(call, 0, constants.NULL_HASH, {
      from: owner,
    });

    // Get proposal ID
    const proposalId = await helpers.getValueFromLogs(tx, "_proposalId");

    // Gather sufficient votes + Execute Proposal
    await dao.genericSchemeParams.votingMachine.absoluteVote.vote(
      proposalId,
      1,
      0,
      helpers.NULL_ADDRESS,
      { from: owner }
    );

    // Verify it's failure (the NFT is owned by nftRecipient)
    const owner = await nftMock.ownerOf(tokenId);
    expect(owner).to.be.eq(nftManager.address);
  });
});
