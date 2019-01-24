pragma solidity ^0.5.0;

contract Escrow {
    /**
      Escrow Contract:
      We use voting to determine who wins the escrow during a dispute

      If both buyer and seller agree with the transaction, they vote accordingly
      and the buyer can release the funds to seller and seller can refund the buyer without the
      involvement of an Arbiter.

      If the transaction is disputed, the Arbiter votes to release the funds to the
      seller or refund the funds to the buyer by voting.

      We use 2/3 voting to decide who wins the dispute.
    **/

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

    modifier fundsNotDisbursed() {
      require(fundsDisbursed == false);
      _;
    }

    modifier isOwner() {
      require(msg.sender == owner);
      _;
    }

    // Release the amount to seller if at least two out of three vote 'True' to release
    function releaseAmountToSeller(address caller) fundsNotDisbursed isOwner public {
      // Disburse the funds only when count is 2
        if ((caller == buyer || caller == seller || caller == arbiter)  && releaseAmount[caller] != true) {
            releaseAmount[caller] = true; // Security Check: The caller did not call releaseAmount before.
            releaseCount += 1;
        }

        if (releaseCount >= 2) {
          // >= : If parties vote at the same time and transactions get processed
          // in the same block
            seller.transfer(amount);
            fundsDisbursed = true;
        }
    }

    // Release the amount to buyer if at least two out of three vote 'True' to refund
    function refundAmountToBuyer(address caller) fundsNotDisbursed isOwner public {
        if ((caller == buyer || caller == seller || caller == arbiter) && releaseAmount[caller] != true) {
            releaseAmount[caller] = true;
            refundCount +=1;
        }

        if (refundCount >= 2) {
          // >= : If parties vote at the same time and transactions get processed
          // in the same block
            buyer.transfer(amount);
            fundsDisbursed = true;
        }
    }

    function escrowInfo() view public returns (address, address, address, bool, uint, uint) {
      // Escrow information for auditing
        return (buyer, seller, arbiter, fundsDisbursed, releaseCount, refundCount);
    }

}
