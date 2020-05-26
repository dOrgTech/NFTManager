const constants = require("./constants");
const { accounts, contract } = require("@openzeppelin/test-environment");
const { assert } = require("chai");

const GenesisProtocol = artifacts.require("GenesisProtocol");

const deployGenesisProtocol = async (
  accounts,
  token,
  avatar,
  voteOnBehalf = constants.NULL_ADDRESS,
  _queuedVoteRequiredPercentage = 50,
  _queuedVotePeriodLimit = 60,
  _boostedVotePeriodLimit = 60,
  _preBoostedVotePeriodLimit = 0,
  _thresholdConst = 2000,
  _quietEndingPeriod = 0,
  _proposingRepReward = 60,
  _votersReputationLossRatio = 10,
  _minimumDaoBounty = 15,
  _daoBountyConst = 10,
  _activationTime = 0
) => {
  var votingMachine = {};

  votingMachine.genesisProtocol = await GenesisProtocol.new(token, {
    from: accounts[0],
    gas: constants.ARC_GAS_LIMIT,
  });

  // set up a reputation system
  votingMachine.reputationArray = [20, 10, 70];
  //   register some parameters
  await votingMachine.genesisProtocol.setParameters(
    [
      _queuedVoteRequiredPercentage,
      _queuedVotePeriodLimit,
      _boostedVotePeriodLimit,
      _preBoostedVotePeriodLimit,
      _thresholdConst,
      _quietEndingPeriod,
      _proposingRepReward,
      _votersReputationLossRatio,
      _minimumDaoBounty,
      _daoBountyConst,
      _activationTime,
    ],
    voteOnBehalf
  );
  votingMachine.params = await votingMachine.genesisProtocol.getParametersHash(
    [
      _queuedVoteRequiredPercentage,
      _queuedVotePeriodLimit,
      _boostedVotePeriodLimit,
      _preBoostedVotePeriodLimit,
      _thresholdConst,
      _quietEndingPeriod,
      _proposingRepReward,
      _votersReputationLossRatio,
      _minimumDaoBounty,
      _daoBountyConst,
      _activationTime,
    ],
    voteOnBehalf
  );

  return votingMachine;
};

module.exports = deployGenesisProtocol;
