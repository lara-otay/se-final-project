const Voting = artifacts.require("Voting");

module.exports = function(deployer) {
  deployer.deploy(Voting, ['Rama', 'Nick', 'Jose'].map(name => web3.utils.asciiToHex(name)));
};


// Added code to interact with the contract after deployment
// deployer.then(async () => {
//   const votingInstance = await Voting.deployed();

//   // Retrieve total votes for a candidate
//   const candidate = "Rama"; // Replace with the desired candidate name
//   const totalVotes = await votingInstance.totalVotesFor(candidate);
//   console.log("Total votes for", candidate, ":", totalVotes);

//   // Cast a vote
//   const candidateToVote = "Nick"; // Replace with the candidate to vote for
//   await votingInstance.voteForCandidate(candidateToVote, { from: accounts[0] });
//   console.log("Vote cast for", candidateToVote);
// });