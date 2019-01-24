# Smartcontract which sets price of a given product name given the product ID

#Create a hashmap of product's id and price
productPrice : map(uint256, uint256)


@public
def setDetails(id: uint256 , price: uint256):
    # Set the price of the product
    self.productPrice[id] = price


@public
@constant
def getDetails(id: uint256) -> uint256:
    # Return the price of the product given a product ID
    return self.productPrice[id]
