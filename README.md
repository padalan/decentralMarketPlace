# Decentralized Ecommerce Store Smart Contract with Escrow service.

Online decentralized market place on Blockchain. Provides Escrow service. Cryptocurrency (Ether) as a mode of payment.

### Description
Shop owners can list their products by paying network fee only while staying anonymous. Customers can buy the product while staying anonymous. Escrow service is enabled. UI images and Description is served from IPFS. Security as priority.

##### Escrow Contract
We use voting to determine who wins the escrow during an event of  dispute.

If both buyer and seller agree with the transaction, they vote accordingly
and the buyer can release the funds to seller or seller can refund the buyer without the
involvement of an Arbiter.

If the transaction is disputed, the Arbiter votes to release the funds to the seller or refund the funds to the buyer by voting.
We use 2/3 voting to decide who wins the dispute.

More features to come.

### About The Project
The project is a Truffle project that allows you to easily compile, migrate and test.

#### About Comments
Since the code is written for educational purpose, I have extensively commented both the Smart Contracts and the JavaScript code.

#### Inheritance from another contracts
Inherited Escrow Smart contract written independently to EcommerceStore contract.

#### Running the app and accessing the UI

App can be deployed in two ways:
* Locally (dev server)
* Rinkeby network (find the details in deployed_addresses.txt)

You can run the app on a dev server locally and access the UI.
See "Run the app" section.

#### Authentication and Signing the contracts
We use Metamask for signing the transactions.

#### Tests
Tests are written in JavaScript. Around 8 tests are written to test the below. Tests are explained with brief code comments.
* Product tests
      ** Add and Get the product (2 tests)
      ** Buy the product
* Escrow tests
      ** Amount is deducted from the buyer's balance after buying and before the escrow settlement
      ** Amount is not released to seller after the buyer purchased and before the escrow settlement
      ** Amount is released to seller after the buyer is Happy about the purchase
      ** Amount is refunded to buyer after the buyer is not happy and the seller wishes to refund the purchase
      ** Dispute: Amount is refunded to buyer after Arbiter rules the dispute in favor of buyer.
      ** Dispute: Amount is refunded to Seller after Arbiter rules the dispute in favor of Seller.


#### Circuit Breakers
Implemented two circuit breakers to validate the Escrow

#### Design patterns
Read about Design patterns' design decisions and implementation in design_pattern_desicions.md file.

#### Security
Security is the most important aspect of a Smart Contract. Read about the measures taken and examples of attackes in avoiding_common_attacks.md file.

#### IPFS
Since storing the data on the Ethereum Blockchain is expensive, I used IPFS to store Images and Description of products.


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
If you get any permission errors regarding truffle and ganache-cli, run the below commands. [source](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally).

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
$ truffle compile
```
### Deployment

Deploy to respective network. Edit truffle.js if needed.
```
truffle deploy
```
 Make sure you see the summary. Should look something like:
 ```
 Summary
=======
> Total deployments:   2
> Final cost:          0.03266108 ETH
```

Run the webserver
```
$ npm run dev (Compilation will fail until you deploy the contracts to Blockchain)
```
The web server could be running on localhost:8081

## Run the tests
We use Truffle to test.

Run below command to test
```
truffle test
```


## Built with
* [Solidity](https://solidity.readthedocs.io/en/v0.4.0/) - The Contract oriented language
* [Mocha](https://github.com/mochajs/mocha) - JavaScript Framework
* [ganache-cli](https://truffleframework.com/ganache) - Local test Blockchain
* [truffle](https://truffleframework.com/) - Suite with tools to test an deploy Smart contracts
* [Web3](https://github.com/ethereum/wiki/wiki/JavaScript-API) - JavaScript app API
* [Infura](https://infura.io/) - An IPFS and Ethereum infrastructure cluster.
* [Metamask](https://metamask.io/) - Allows you to run Ethereum dApps in your browser.
* [IPFS](https://ipfs.io/) - IPFS makes it possible to distribute high volumes of data with high efficiency  
