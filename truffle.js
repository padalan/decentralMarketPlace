// Allows us to use ES6 in our migrations and tests.
require('babel-register')
require('babel-polyfill')
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "eye warrior stumble resource ride athlete gather food end rug remind tide";


module.exports = {
  networks: {
    development: {
      host: '127.0.0.1', // Running ganache-cli on localhost
      port: 8545, // Running ganache-cli on 8545
      network_id: '*' // Match any network id
    }
  }
}

/*
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic,"https://rinkeby.infura.io/v3/e843ddd2050f4bb09c46fe7566411b57");
      },
      network_id: 1
    }
  }
};

*/
