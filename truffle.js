// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1', // Running ganache-cli on localhost
      port: 8545, // Running ganache-cli on 8545
      network_id: '*' // Match any network id
    }
  }
}
