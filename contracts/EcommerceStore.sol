pragma solidity ^0.5.0;

// Create Contract
contract EcommerceStore {

    // Create ennumerated type with two members for product considiton
    enum ProductCondition { New, Old }

    //Declare ProductIndex we will be using to identify products
    uint public ProductIndex;

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
    }

    constructor() public {
        // Initialize ProductIndex to zero.
        ProductIndex = 0;
    }

    // For each seller we can lookup the product by their address and Id using sotres Hashmap
    //product = stores[address][id]
    mapping(address => mapping(uint => Product)) stores;

    // Given a product id, we ca find the owner using ProductIdinStore hashmap
    // address = productIdinStore[id]
    mapping(uint => address) productIdinStore;

    // We can find the product with only id from the above two hashmaps
    // product = stores[productIdinStore[id]][id] -- used in buy function.

    //Add product to the blockchain
    function addProduct( string memory _name, string memory _category, uint _price, uint _condition, string memory _descLink, string memory _imgLink) public {
        // Increment the productIndex for every product. This variable is stored as id in the product structure
        ProductIndex += 1;

        // Create the product structure
        Product memory product = Product(ProductIndex, _name, _category, _price, ProductCondition(_condition), address(0), _descLink, _imgLink );
        stores[msg.sender][ProductIndex] = product;
        productIdinStore[ProductIndex] = msg.sender;
    }

    // Getter function which returns product details given a product id.
    function getProduct(uint _id) public view returns(uint, string memory, string memory, uint, ProductCondition, address, string memory, string memory) {
        Product memory product = stores[productIdinStore[_id]][_id];
        return (product.id, product.name, product.category, product.price, product.condition, product.buyer, product.descLink, product.imgLink);
    }

    // Buy a product using product id.
    function buy(uint _id) payable public {
      Product memory product = stores[productIdinStore[_id]][_id];
      require(product.buyer == address(0));
      require(msg.value >= product.price);
      product.buyer = msg.sender;
      stores[productIdinStore[_id]][_id] = product;
    }

}
