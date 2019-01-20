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
$ cd ../
$ sudo apt install git nodejs npm
$ npm install -g --save truffle ganache-cli

```
If you get any permission errors such as below for truffle and ganache-cli, run the below commands. [source](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally).

```
$ mkdir ~/.npm-global
$ npm config set prefix '~/.npm-global'
$ export PATH=~/.npm-global/bin:$PATH
$ source ~/.profile
$ npm install -g --save truffle ganache-cli

```
Optional, but suggested: If you are running bash, run the below: (Do the required for your shell)
```
$ cp ~/.bashrc ~/.bashrc_orig
$ echo -e "\n\n# Add npm global path\nexport PATH=~/.npm-global/bin:$PATH" >> ~/.bashrc
```

Clone the git repository:
```
$ git clone https://github.com/padalan/decentralMarketPlace.git
$ cd decentralMarketPlace
```
Install required node modules: (make sure you are in decentralmarketPlace directory)
```
$ npm install
```

Install Metamask for the browser and connect to the appropriate Blockchain with valid accounts with ether in them.

# Configuration and Daemons

Configure IPFS and start the IPFS daemon
```
$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"POST\", \"GET\"]"
$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'
$ ipfs daemon (make sure the daemon is running successfully on port 8080)
```

Run ganache-cli, node-console(optional)
```
$ ganache-cli -q (new terminal)
$ cd to $PROJECT_DIRECTORY (new terminal)
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

Run the webserver
```
$ npm run dev (Compilation will fail until you deploy the contracts to Blockchain)
```
The web server could be running on localhost:8081

## Run the tests
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
