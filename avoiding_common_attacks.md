Avoiding Common Attacks
===

Reference:
https://consensys.github.io/smart-contract-best-practices/known_attacks/#race-conditions42

## Reentrancy attacks

Reentrancy attacks can be problematic because calling external contracts passes control flow to them. The called contract may end up calling the smart contract function again in a recursive manner.

To prevent that a function could be called repeatedly, like "addProduct()" function. The function set one value to the productId in the struct. ProductIndex is incremented every time the contract is run, so that only unique productIndex is created for each new product listing.

## Front Running (AKA Transaction-Ordering Dependence)

As stated n the documentation, the attack is based on how transactions are included in the blockchain and considerations around the process. Transactions that are broadcast to the network but have not yet been included in a block are in the mempool. Miners choose the order in which to include transactions from the mempool into a block that they are mining. Also, since transactions are in the mempool before they make it into a block, anyone can know what transactions are about to occur on the network.

Solution: Escrow service
I had to implement Escrow (Auction would have worked too) for this specific reason. This kind of attacks are very possible in decentralized markets such as this project. Implemented Escrow service which would protect the buyer or seller. Unless the buyer or seller is the same person, Escrow service will protect us from this attack. In case where seller and buyer are the same, there is no loss.

Frontend is designed keeping this attack in mind.

## Timestamp Dependence

It's known that the that the timestamp of the block can be manipulated by the miner. Haven't used any time based services in the contract. Would have applied if auction were to be implemented.

## Integer Overflow and Underflow

The max value for an unsigned integer is 2 ^ 256 - 1, which is roughly 1.15 times 10 ^ 77. If an integer overflows, the value will go back to 0. For example, a variable called score of type uint8 storing a value of 255 that is incremented by 1 will now be storing the value 0.

In this project, uint are used to set price and condition (0 or 1) of the product. It's not necessary to implement a Math Library in this project.

This attack does not apply to our contract

## Denial of Service

Another danger of passing execution to another contract is a denial of service attack. This project does not have any loops implemented. We did not use any dynamic array in this project

## Forcibly Sending Ether to a Contract

It is possible to send ether to a contract without triggering its fallback function. Using the selfdestruct function on another contract and using the target contract as the recipient will force the destroyed contract’s funds to be sent to the target. It is also possible to precompute a contracts address and send ether to the address before the contract is deployed. The contract’s balance will be greater than 0 when it is finally deployed.

fallback functions are not used in this contract. The contract does not calcualte anything based on contract's balance.
