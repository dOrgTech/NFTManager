const constants = require("./constants");
const { accounts, contract } = require("@openzeppelin/test-environment");
const { assert } = require("chai");

const AbsoluteVote = artifacts.require("AbsoluteVote");

const deployAbsoluteVote = async function (voteOnBehalf=constants.NULL_ADDRESS, precReq=50 ) {
    var votingMachine = {};
    votingMachine.absoluteVote = await AbsoluteVote.new();

    // register some parameters
    await votingMachine.absoluteVote.setParameters( precReq, voteOnBehalf);
    votingMachine.params = await votingMachine.absoluteVote.getParametersHash( precReq, voteOnBehalf);
    return votingMachine;
  };
  

module.exports = deployAbsoluteVote;
