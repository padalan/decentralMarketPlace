# Decentralized Ecommerce Store Smart Contract with Escrow service.

Online decentralized market place on Blockchain. Provides Escrow service. Cryptocurrency (Ether) as a mode of payment.

### Description
Shop owners can list their products by paying only network fee while staying anonymous. Customers can buy the product while staying anonymous. Escrow service is enabled. UI images and Description are served from IPFS.

##### Escrow Contract
We use voting to determine who wins the escrow during an event of  dispute.

If both buyer and seller agree with the transaction, they vote accordingly
and the buyer can release the funds to seller or seller can refund the buyer without the
involvement of an Arbiter.

If the transaction is disputed, the Arbiter votes to release the funds to the seller or refund the funds to the buyer by voting.
We use 2/3 voting to decide who wins the dispute.

### About The Project
The project is a Truffle project that allows us to easily compile, migrate and test.

#### About Comments
Since the code is written for educational purpose, I have extensively commented both the Smart Contracts and the JavaScript code.

#### Inheritance from another contracts
Inherited Escrow Smart contract to EcommerceStore contract.
Installed Oracalize using EthPM and imported it to another contract.

#### Running the app and accessing the UI

App can be deployed locally.
Smart contract is deployed on Rinkeby network (find the details in deployed_addresses.txt)

You can run the app on a dev server locally and access the UI.
You can also access the UI while the contract is running on Rinkeby netowrk.

#### Authentication and Signing the contracts
Tested with Metamask for signing the transactions.

#### Tests
Eight Tests are written in JavaScript. Tests are explained with brief code comments.
* Product tests
     1. Add and Get the product (2 tests)
     2. Buy the product
* Escrow tests
     1. Amount is deducted from the buyer's balance after buying and before the escrow settlement
     2. Amount is not released to seller after the buyer purchased and before the escrow settlement
     3. Amount is released to seller after the buyer is Happy about the purchase
     4. Amount is refunded to buyer after the buyer is not happy and the seller wishes to refund the purchase
     5. Dispute: Amount is refunded to buyer after Arbiter rules the dispute in favor of buyer.
     6. Dispute: Amount is refunded to Seller after Arbiter rules the dispute in favor of Seller.


#### Circuit Breakers
Implemented two circuit breakers to validate the Escrow.

#### Design patterns
Read about Design patterns' design decisions and implementation in design_pattern_desicions.md file.

#### Security
Security is the most important aspect of a Smart Contract. Read about the measures taken and examples of attackes in avoiding_common_attacks.md file.

#### IPFS
Since storing the data on the Ethereum Blockchain is expensive, I used IPFS to store Images and Description of products.

#### Oracle service
Used oracalize to get gas and price information.

#### Vyper contracts
Implemented two vyper contracts. Will integrate the functionality in the future.

## Getting Started

### Installing

The installation has been tested on Ubuntu 18.04.1 LTS (Bionic Beaver)

Install IPFS, NodeJS and associated packages:
Download go-ipfs from https://dist.ipfs.io/#go-ipfs for your platform.
```
$ tar xvfz go-ipfs.tar.gz
$ cd go-ipfs
$ ./install.sh
$ cd ../
$ sudo apt-get update
$ sudo apt-get -y upgrade
$ sudo apt install git nodejs npm
$ npm install -g --save truffle ganache-cli

```
Sugested: If you get any permission errors regarding truffle and ganache-cli, run the below commands. [source](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally).

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

Install Vyper: (On ubuntu 16.10)
Please refer https://vyper.readthedocs.io/en/latest/installing-vyper.html
```
$ sudo apt-get install python3.6 python3-dev
$ sudo apt install virtualenv
$ virtualenv -p python3.6 --no-site-packages ~/vyper-venv
$ source ~/vyper-venv/bin/activate
$ git clone https://github.com/ethereum/vyper.git
$ cd vyper
$ make
$ make test
```

Install Ethereum-Bridge

```
npm install -g ethereum-bridge
```

#### Clone decentralMarketPlace
Clone the git repository:
```
$ git clone https://github.com/padalan/decentralMarketPlace.git
$ cd decentralMarketPlace
```
Install required node modules: (make sure you are in decentralmarketPlace directory. This might take a while)
```
$ npm install
```

Install Metamask for the browser and connect to the appropriate Blockchain with valid accounts with ether in them.

# Configuration and Daemons

Configure IPFS and start the IPFS daemon
```
$ ipfs init
$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"POST\", \"GET\"]"
$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials '["true"]'
$ ipfs daemon (make sure the daemon is running successfully on port 8080)
```

Run ganache-cli
```
$ ganache-cli -q (new terminal)
$ cd to $PROJECT_DIRECTORY (new terminal)
```
Run the ethereum-bridge using web3.eth.accounts[8]
```
$ ethereum-bridge -H localhost:8545 -a 8
```
If you run into an error something like:
```
.npm-global/lib/node_modules/ethereum-bridge/node_modules/bitcore-mnemonic/node_modules/bitcore-lib/index.js:12
    throw new Error(message);
    Error: More than one instance of bitcore-lib found. Please make sure to require bitcore-lib and check that submodules do not also include their own bitcore-lib dependency.

```
Please do the following as suggested [here](https://github.com/bitpay/bitcore/issues/1454)

```
in the below file:
~/.nvm/versions/node/v4.8.3/lib/node_modules/bitcore/node_modules/insight-api/node_modules/bitcore-lib/index.js
line 7:
bitcore.versionGuard = function(version) {
Change it to:
bitcore.versionGuard = function(version) { return;

$ ethereum-bridge -H localhost:8545 -a 8
```

Get the Oraclize Address Resolver (OAR) from the console and replace it with the OAR in decentralMarketPlace/contracts/GetETHUSD.sol file.
```
Please add this line to your contract constructor in decentralMarketPlace/contracts/GetETHUSD.sol:
OAR = OraclizeAddrResolverI(0x14D72081EaFb56E80341108ff8045b8fBd250471);
```

## Compilation

Configure truffle.js to make sure you connect to the Blockchain network.
You must be in vyper virtual environment to compile vyper Smart Contracts

At this point you have three terminals open running the below:
1. ipfs daemon
2. ganache-cli
3. ethereum-bridge

### Deployment

Deploy to respective network. Edit truffle.js if needed. Should be in decentralMarketPlace directory
```
$ source ~/vyper-venv/bin/activate
$ truffle migrate --compile-all --reset

```
 
```

 Summary
 =======
 > Total deployments:   5
 > Final cost:          15.11725086 ETH // The high Cost is due to Oraclize service.

```

Run the webserver
```
$ npm run dev (Compilation will fail until you deploy the contracts to Blockchain)
```
The web server could be running on localhost:8081

In Chrome web browser go to http://localhost:8081
(I tested only in Chrome. Firefox is unpreditable with my JavaScript)

## Run the tests
We use Truffle to test.

Run below command to test
```
truffle test
```
## On the web UI
Initialize MetaMask and make sure you are connected to the appropriate Blockchain network (localhost:8545 ). Import accounts from ganache-cli is needed. It could be any accounts on ganache-cli. Last account of ganache-cli is reserved to be Arbiter.
If using rinkeby, see deployed_addresses.txt

#### How to buy a product
* Click on details of the product on the home page
* Click 'Buy'.
* Verify and accept the charges on Metamask pop-up.

#### How To add a product listing
* Go to List Item from the home page
* Fill the form
* Click on 'Add Product To Store'
* Verify and Pay the Network and listing fees.
     
#### Escrow service:
* After the product is purchased, click on details.
* As a Seller, Buyer and Arbiter Click on 'Release Amount to Seller' or 'Refund Amount to Buyer'.
* Check the escrow information.
* We use voting to determine who wins the escrow during a dispute
     
If both buyer and seller agree with the transaction, they vote accordingly and the buyer can release the funds to seller and seller can refund the buyer without the involvement of an Arbiter. If the transaction is disputed, the Arbiter votes to release the funds to the seller or refund the funds to the buyer by voting. The contract uses 2/3 voting to decide who wins the dispute.

There is a possibility of adding mulitple arbiters by implementing expandable array in the contract.
 

## Built with
* [Solidity](https://solidity.readthedocs.io/en/v0.4.0/) - The Contract oriented language
* [Mocha](https://github.com/mochajs/mocha) - JavaScript Framework
* [ganache-cli](https://truffleframework.com/ganache) - Local test Blockchain
* [truffle](https://truffleframework.com/) - Suite with tools to test an deploy Smart contracts
* [Web3](https://github.com/ethereum/wiki/wiki/JavaScript-API) - JavaScript app API
* [Infura](https://infura.io/) - An IPFS and Ethereum infrastructure cluster.
* [Metamask](https://metamask.io/) - Allows you to run Ethereum dApps in your browser.
* [IPFS](https://ipfs.io/) - IPFS makes it possible to distribute high volumes of data with high efficiency  
