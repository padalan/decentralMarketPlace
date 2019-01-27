var EcommerceStore = artifacts.require("./EcommerceStore.sol");
var EcommCoin = artifacts.require("EcommCoin");
var GetETHUSD = artifacts.require("./GetETHUSD.sol");


// last account in ganache-cli is assigned as arbiter.
module.exports = function(deployer) {
  // deployer.deploy(EcommerceStore, "0x69873c206f169aa90e54df724a273693c9eac990"); // Rinkeby Arbiter Address
  deployer.deploy(EcommerceStore, web3.eth.getAccounts().then(function (f) { return f[9] }));
  deployer.deploy(GetETHUSD, { value: 15000000000000000000 });
  deployer.deploy(EcommCoin, 1000000000);
  // Supply of the coin set to 1 billion
  // Arbiter gets 1 mil in funding for testing
};
