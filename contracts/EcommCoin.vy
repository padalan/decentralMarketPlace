# The EcommerceStore could use a token of it's own
# Created EcommerceStore Coin (ECC) (Not ERC20 compliant)
# Experimentation with Vyper

supply: public(uint256)

name: public(bytes[30])
symbol: public(bytes[3])
balances: map(address, uint256)

@public
def __init__(supply_: uint256):
    self.supply = supply_
    self.name = "EcommerceStoreCoin"
    self.symbol = "ECC"
    self.balances[msg.sender] = supply_

@public
def transfer(amount_: uint256, recipient_: address):
    self.balances[msg.sender] = self.balances[msg.sender] - amount_
    self.balances[recipient_] = self.balances[recipient_] + amount_
