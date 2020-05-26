// Load dependencies
const { accounts, contract } = require("@openzeppelin/test-environment");
const { expect } = require("chai");

// Load compiled artifacts
const NFTManager = artifacts.require("NFTManagerUpgradeSafe");

// Start test block
describe("NFTManager", function() {
  const [owner] = accounts;

  beforeEach(async function() {
    // Deploy a new Box contract for each test
    this.contract = await NFTManager.new({ from: owner });
  });
  it("Owner can transfer ownership", async function() {});
  it("New owner can perform sendNFT Operation", async function() {});
  it("Old owner cannot perform sendNFT Operation", async function() {});
  it("Owner can renounce ownership", async function() {});
  it("Old owner cannot perform sendNFT Operation", async function() {});
});
