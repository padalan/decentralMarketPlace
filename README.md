# Decentralized Ecommerce Store Smart Contract

Online decentralized market place on Blockchain. Cryptocurrency (Ether) as mode of payment.

Shop owners can list their products by paying network fee only while staying anonymous. Customers can buy the product while staying anonymous. Escrow service is enabled. UI images and Description is served from IPFS.

More features to come.

## Getting Started

### Installing
Install IPFS, NodeJS and associated packages:
Download go-ipfs from https://dist.ipfs.io/#go-ipfs for your platform.
```
$ tar xvfz go-ipfs.tar.gz
$ cd go-ipfs
$ ./install.sh
sudo apt install nodejs npm
npm install --save solc mocha ganache-cli web3@1.0.0-beta.26 truffle-hdwallet-provider@0.0.3

```
Install Metamask for the browser and connect to the appropriate Blockchain with valid accounts with ether in them.

## Starting the daemons

Run ipfs, ganache-cli, webpack, node-console(optional)
```
$ ipfs-daemon (make sure the daemon is running successfully, usually on port 8080)
$ ganache-cli -q (new terminal)
$ cd $PROJECT_DIR/ (new terminal)
$ npm run dev (Compilation might fail until you deploy the contracts to Blockchain. But that's OK.)
$ truffle console (new terminal)
```

## Compilation
Configure truffle.js to make sure you connect to the Blockchain network.
To compile, in truffle console run:
```
truffle(development)> compile
truffle(development)> migrate
```
Alternatively, to compile and deploy you can run:
```
truffle(development)> migrate --reset
```
 Make sure you see the summary. Should look something like:
 ```
 Summary
=======
> Total deployments:   4
> Final cost:          0.03266108 ETH
```
## Running the tests
We use mocha, a JavaScript framework to test.

Run below command to test
```
npm run test
```

## Deployment
Edit the seed mnemonics and run
```
node deploy.js
```

## Built with
* [Solidity](https://solidity.readthedocs.io/en/v0.4.0/) - The Contract oriented language
* [Mocha](https://github.com/mochajs/mocha) - JavaScript Framework
* [ganache-cli](https://truffleframework.com/ganache) - Local test Blockchain
* [truffle](https://truffleframework.com/) - Suite with tools to test an deploy Smart contracts
* [Web3](https://github.com/ethereum/wiki/wiki/JavaScript-API) - JavaScript app API
* [Infura](https://infura.io/) - An IPFS and Ethereum infrastructure cluster.
* [Metamask](https://metamask.io/) - Allows you to run Ethereum dApps in your browser.
