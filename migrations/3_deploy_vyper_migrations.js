// I wrote the vyper contracts as requirement to this course.
var EcommCoin = artifacts.require("EcommCoin"); // Not ERC20 compliant
var ProductDetails = artifacts.require("ProductDetails");


// last account in ganache-cli is assigned as arbiter.
module.exports = function(deployer) {
  deployer.deploy(EcommCoin, 1000000000);
  // Supply of the coin set to 1 billion
  // Arbiter gets 1 mil in funding for testing
  deployer.deploy(ProductDetails)
};
