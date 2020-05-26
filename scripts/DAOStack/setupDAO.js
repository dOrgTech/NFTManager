/*
    Deploy:
    DAO from Arc
    NFT Manager
    ERC721s' from OZ and others (any non-standard ones we should worry about?)
    Gnosis Safe recipient
*/
const constants = require("./constants");
const { accounts, contract } = require("@openzeppelin/test-environment");
const { assert } = require("chai");

const deployGenesisProtocol = require('./deployGenesisProtocol');
const deployAbsoluteVote = require('./deployAbsoluteVote');

const NFTManager = artifacts.require("NFTManagerUpgradeSafe");
const ERC20Mock = artifacts.require("ERC20Mock");
const ControllerCreator = artifacts.require("ControllerCreator");
const DAOTracker = artifacts.require("DAOTracker");
const DaoCreator = artifacts.require("DaoCreator");
const GenericScheme = artifacts.require("GenericScheme");
const Avatar = artifacts.require("Avatar");
const Redeemer = artifacts.require("Redeemer");
const DAOToken = artifacts.require("DAOToken");
const Reputation = artifacts.require("Reputation");
const AbsoluteVote = artifacts.require("AbsoluteVote");
const GenesisProtocol = artifacts.require("GenesisProtocol");


const setupDAO = async function(
  accounts,
  contractToCall = 0,
  reputationAccount = 0,
  genesisProtocol = false,
  tokenAddress = 0
) {
  const [owner] = accounts;

  var testSetup = {};
  testSetup.standardTokenMock = await ERC20Mock.new(accounts[1], 100, {
    from: owner,
  });
  var controllerCreator = await ControllerCreator.new({
    from: owner,
    gas: constants.ARC_GAS_LIMIT,
  });
  var daoTracker = await DAOTracker.new({
    from: owner,
    gas: constants.ARC_GAS_LIMIT,
  });
  testSetup.daoCreator = await DaoCreator.new(
    controllerCreator.address,
    daoTracker.address,
    { from: owner, gas: constants.ARC_GAS_LIMIT }
  );
  testSetup.reputationArray = [200, 10, 70];

  const org = await setupOrganizationWithArrays(
    testSetup.daoCreator,
    [accounts[0], accounts[1], accounts[2]],
    [1000, 1000, 1000],
    testSetup.reputationArray
  );

  testSetup.genericScheme = await GenericScheme.new({ from: owner });
  testSetup.genericSchemeParams = await setupGenericSchemeParams(
    testSetup.genericScheme,
    accounts,
    contractToCall,
    genesisProtocol,
    tokenAddress,
    org.avatar
  );

  testSetup = {
    ...testSetup,
    ...org
  }

  // var permissions = "0x00000010";

  // await testSetup.daoCreator.setSchemes(
  //   testSetup.org.avatar.address,
  //   [testSetup.genericScheme.address],
  //   [helpers.NULL_HASH],
  //   [permissions],
  //   "metaData"
  // );

  return testSetup;  
};

const setupOrganizationWithArrays = async function(
  daoCreator,
  daoCreatorOwner,
  founderToken,
  founderReputation,
  cap = 0
) {
  const org = {};

  const tx = await daoCreator.forgeOrg(
    "testOrg",
    "TEST",
    "TST",
    daoCreatorOwner,
    founderToken,
    founderReputation,
    cap,
    { gas: constants.ARC_GAS_LIMIT }
  );

  console.log('tx.logs', tx);

  const newOrgLog = tx.logs.find(log => {
    return log.event == 'NewOrg';
  });

  console.log('newOrgLog', newOrgLog);

  assert.equal(tx.logs.length, 1);
  assert.equal(tx.logs[0].event, "NewOrg");

  const avatarAddress = tx.logs[0].args._avatar;
  org.avatar = await Avatar.at(avatarAddress);

  const tokenAddress = await org.avatar.nativeToken();
  org.token = await DAOToken.at(tokenAddress);

  const reputationAddress = await org.avatar.nativeReputation();
  org.reputation = await Reputation.at(reputationAddress);
  return org;
};

const setupGenericSchemeParams = async function(
  genericScheme,
  accounts,
  contractToCall,
  genesisProtocol = false,
  tokenAddress = 0,
  avatar
) {
  var genericSchemeParams = {};
  if (genesisProtocol === true) {
    genericSchemeParams.votingMachine = await deployGenesisProtocol(
      accounts,
      tokenAddress,
      0,
      helpers.NULL_ADDRESS
    );
    await genericScheme.initialize(
      avatar.address,
      genericSchemeParams.votingMachine.genesisProtocol.address,
      genericSchemeParams.votingMachine.params,
      contractToCall
    );
  } else {
    genericSchemeParams.votingMachine = await deployAbsoluteVote(
      constants.NULL_ADDRESS,
      50,
      genericScheme.address
    );
    await genericScheme.initialize(
      avatar.address,
      genericSchemeParams.votingMachine.absoluteVote.address,
      genericSchemeParams.votingMachine.params,
      contractToCall
    );
  }
  return genericSchemeParams;
};

module.exports = {
  setupDAO,
};
