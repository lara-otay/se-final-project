let candidates = {"Ahmad": "candidate-1", "Khaled": "candidate-2", "Mohammad": "candidate-3"}

const App = {
  web3: null,
  account: null,
  voting: null,

  start: async function() {
    const { web3 } = this;

    try {
      await this.loadVotingContract();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = networks[networkId];
      this.voting = new web3.eth.Contract(
        abi,
        deployedNetwork.address,
      );

      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      this.loadCandidatesAndVotes();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  async loadVotingContract() {
    try {
      const { networks, abi } = await import('../../build/contracts/Voting.json');
      this.networks = networks;
      this.abi = abi;
    } catch (error) {

    }
  },

  loadCandidatesAndVotes: async function() {
    const { totalVotesFor } = this.voting.methods;
    let candidateNames = Object.keys(candidates);
    for (var i = 0; i < candidateNames.length; i++) {
      let name = candidateNames[i];
      var count = await totalVotesFor(this.web3.utils.asciiToHex(name)).call();
      $("#" + candidates[name]).html(count);
    }
  },

  voteForCandidate: async function() {
    let candidateName = $("#candidate").val();
    $("#msg").html("Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.")
    $("#candidate").val("");

    const { totalVotesFor, voteForCandidate } = this.voting.methods;
    
    await voteForCandidate(this.web3.utils.asciiToHex(candidateName)).send({gas: 140000, from: this.account});
    let div_id = candidates[candidateName];
    var count = await totalVotesFor(this.web3.utils.asciiToHex(candidateName)).call();
    $("#" + div_id).html(count);
    $("#msg").html("");
  }
  
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); 
    console.log("Success");

  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:7545.",
    );    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
    );
  }

  App.start();
});

