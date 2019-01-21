pragma solidity ^0.5.0;

contract Escrow {
    address payable public buyer;
    address payable public seller;
    address public arbiter;
    uint public productId;
    uint public amount;
    mapping(address => bool) releaseAmount;
    mapping(address => bool) refundAmount;
    uint public releaseCount;
    uint public refundCount;
    bool public fundsDisbursed;
    address public owner;

    constructor(uint _productId, address payable _buyer, address payable _seller, address _arbiter) payable public {
        productId = _productId;
        buyer = _buyer;
        seller = _seller;
        arbiter = _arbiter;
        fundsDisbursed = false;
        amount = msg.value;
        owner = msg.sender;
    }

    // Release the amount to seller if at least two out of three vote 'True' to release
    function releaseAmountToSeller(address caller) public {
        require(fundsDisbursed == false);
        require(msg.sender == owner);
        if ((caller == buyer || caller == seller || caller == arbiter)  && releaseAmount[caller] != true) {
            releaseAmount[caller] = true; //Security Check: The caller did not call releaseAmount before.
            releaseCount += 1;
        }

        if (releaseCount == 2) {
            seller.transfer(amount);
            fundsDisbursed = true;
        }
    }

    // Release the amount to buyer if at least two out of three vote 'True' to refund
    function refundAmountToBuyer(address caller) public {
        require(fundsDisbursed == false);
        require(msg.sender == owner);
        if ((caller == buyer || caller == seller || caller == arbiter) && releaseAmount[caller] != true) {
            releaseAmount[caller] = true;
            refundCount +=1;
        }

        if (refundCount == 2) {
            buyer.transfer(amount);
            fundsDisbursed = true;
        }
    }

    function escrowInfo() view public returns (address, address, address, bool, uint, uint) {
        return (buyer, seller, arbiter, fundsDisbursed, releaseCount, refundCount);
    }

}
