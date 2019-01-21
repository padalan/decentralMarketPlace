var EcommerceStore = artifacts.require("./EcommerceStore.sol");

// last account in ganache-cli is assigned as arbiter.
module.exports = function(deployer) {
  deployer.deploy(EcommerceStore, web3.eth.getAccounts().then(function (f) { return f[9] }));
};
