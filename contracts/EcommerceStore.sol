pragma solidity ^0.5.0;

import "contracts/Escrow.sol";

// Create Contract
contract EcommerceStore {

    // Create ennumerated type with two members for product considiton
    enum ProductCondition { New, Old }

    //Declare ProductIndex we will be using to identify products
    uint public ProductIndex;

    address public arbiter;
    // Product structure.
    struct Product {
        uint id;
        string name;
        string category;
        uint price;
        ProductCondition condition;
        address buyer;
        string descLink;
        string imgLink;
        address seller;
    }

    constructor(address _arbiter) public {
        // Initialize ProductIndex to zero.
        ProductIndex = 0;
        arbiter = _arbiter;
    }

    // For each seller we can lookup the product by their address and Id using sotres Hashmap
    //product = stores[address][id]
    mapping(address => mapping(uint => Product)) stores;

    // Given a product id, we ca find the owner using ProductIdinStore hashmap
    // address = productIdinStore[id]
    mapping(uint => address payable) productIdinStore;

    // We can find the product with only id from the above two hashmaps
    // product = stores[productIdinStore[id]][id] -- used in buy function.

    // For each product what is the address of the Escrow
    mapping(uint => address) productEscrow;

    //Add product to the blockchain
    function addProduct( string memory _name, string memory _category, uint _price, uint _condition, string memory _descLink, string memory _imgLink) public {
        // Increment the productIndex for every product. This variable is stored as id in the product structure
        ProductIndex += 1;

        // Create the product structure
        Product memory product = Product(ProductIndex, _name, _category, _price, ProductCondition(_condition), address(0), _descLink, _imgLink, msg.sender );
        stores[msg.sender][ProductIndex] = product;
        productIdinStore[ProductIndex] = msg.sender;
    }

    // Getter function which returns product details given a product id.
    function getProduct(uint _id) public view returns(uint, string memory, string memory, uint, ProductCondition, address, string memory, string memory, address) {
        Product memory product = stores[productIdinStore[_id]][_id];
        return (product.id, product.name, product.category, product.price, product.condition, product.buyer, product.descLink, product.imgLink, product.seller);
    }

    // Buy a product using product id.
    function buy(uint _id) payable public {
      Product memory product = stores[productIdinStore[_id]][_id];
      require(product.buyer == address(0));
      require(msg.value >= product.price);
      product.buyer = msg.sender;
      stores[productIdinStore[_id]][_id] = product;
      Escrow escrow = (new Escrow).value(msg.value)(_id, msg.sender, productIdinStore[_id], arbiter);
      productEscrow[_id] = address(escrow);
    }

    function escrowInfo(uint _id) view public returns (address, address, address, bool, uint, uint) {
      return Escrow(productEscrow[_id]).escrowInfo();
    }

    function releaseAmountToSeller(uint _id) public {
      Escrow(productEscrow[_id]).releaseAmountToSeller(msg.sender);
    }

    function refundAmountToBuyer(uint _id) public {
      Escrow(productEscrow[_id]).refundAmountToBuyer(msg.sender);
    }

}
