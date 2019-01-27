Desing Patters Decisions
===

## Contract Architecture

EcommerceStore contract has two smart contracts
```
Contracts
|___EcommerceStore.sol
|	|___ Escrow.sol
|
```
 [ Vyper contracts are implemented to extend the functionality. Contracts are still under development ]

### EcommerceStore contract

Use EcommerceStore contract to add a product listing, get the product details and buy.
EcommerStore contract inherits Escrow functionalities from Escrow contract.

### Escrow contract

Escrow contract provides Escrow Services based on voting. A decision, either to release amount to seller or refund amount to buyer, with 2/3 majority votes wins the dispute. Provides Escrow information functionality to know the current voting results and for transparency.

### Modifiers - Circuit breakers

Modifiers are used in smart contracts to make sure that certain conditions are met before proceeding to executing the rest of the body of code in the method.

Two modifiers are implemented in Escrow Contract.
* 'isOwner' modifier to check with a require condition that it is the owner who executes the function.
* 'fundsNotDisbursed' modifier to make sure the escrow is not already settled.


### Arbiter account.

Arbiter account is to be defined during the deployment of the EcommerStore contract. Please see file '2_deploy_migrations.js' on how it's done.

For our test purposes I used the last account 'web3.eth.getAccounts()[9]' of ganache-cli as arbiter. We could use any address. We can add multiple arbiters too. See Design Patterns.


### Struct

EcommerceStore contract uses a Struct to store the information of a product.
Escrow contract uses a struct to store escrow information of a given product.

### Mapping

I have implemented three mappings.

1. For each seller we can lookup the product by their address and Id using stores Hashmap.
    Product = stores[address][id]
    ```
    mapping(address => mapping(uint => Product)) stores;
    ```

2. Given a product id, we can find the owner using ProductIdinStore hashmap.
    address = productIdinStore[id]
    ```
    mapping(uint => address payable) productIdinStore;
    ```

We can find the product with only id from the above two hashmaps
product = stores[productIdinStore[id]][id] -- used in buy function.

3. For each product we can find the address of the Escrow address
    ```
    mapping(uint => address) productEscrow;
    ```


Mapping is used for security purposes, if someone want to loop over the mapping to see Identity information, need to do with bytes32 elements using javascript. Not possible in Solidity because the Gas will reject the transaction.

### Library
Inherited Escrow contract by extending the contract.
Installed Oraclize from Ethpm.

## Oraclize contract

Two querys to get offchain information:
- Gas Price of Ethereum mainnet
- ETHUSD price


## Other possible implementatios
We could have a dynamic array to store multiple arbiters for this project.
Extend the Product struct to hold more information such as auction information.
