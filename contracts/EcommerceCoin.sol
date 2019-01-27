pragma solidity ^0.5.0;
import 'zeppelin/contracts/token/StandardToken.sol';
contract EcommerceCoin is StandardToken {

  string public symbol = "ECC5";
  string public name = "EcommerCoin";
  uint8 public decimals = 18;

  constructor() public {
    balances[msg.sender] = 1000 * (10 ** uint256(decimals));
    totalSupply = 1000 * (10 ** uint256(decimals));
  }
}
