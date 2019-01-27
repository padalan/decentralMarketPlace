pragma solidity ^0.5.0; // Solidity Version 0.5.0

// Inherit Escrow from another local contract
import "contracts/Escrow.sol";

// Create Contract
contract EcommerceStore {
    // Contract to list an Item and buy in a Marketplace.

    // Create ennumerated type with two members for product condition
    enum ProductCondition { New, Old }

    // ProductIndex is used to identify products
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
        string descLink; // Hash of Description uploaded to IPFS
        string imgLink;  // Hash of Image uploaded to IPFS.
        address seller;
    }

    event LogCurrentAccount(address currentAccount);

    constructor(address _arbiter) public {
        // Initialize ProductIndex to zero.
        ProductIndex = 0;
        arbiter = _arbiter;
        emit LogCurrentAccount(msg.sender);
    }

    // For each seller we can lookup the product by their address and Id using stores Hashmap
    // product = stores[address][id]
    mapping(address => mapping(uint => Product)) stores;

    // Given a product id, we can find the owner using ProductIdinStore hashmap
    // address = productIdinStore[id]
    mapping(uint => address payable) productIdinStore;

    // We can find the product with only id from the above two hashmaps
    // product = stores[productIdinStore[id]][id] -- used in buy function.

    // For each product what is the address of the Escrow
    mapping(uint => address) productEscrow;

    // Add product to the blockchain
    function addProduct( string memory _name, string memory _category, uint _price, uint _condition, string memory _descLink, string memory _imgLink) public {
        // Increment the productIndex for every product. This variable is stored as id in the product structure
        ProductIndex += 1;

        // Create the product structure
        Product memory product = Product(ProductIndex, _name, _category, _price, ProductCondition(_condition), address(0), _descLink, _imgLink, msg.sender );
        stores[msg.sender][ProductIndex] = product;
        productIdinStore[ProductIndex] = msg.sender;
        emit LogCurrentAccount(msg.sender);
    }


    // Getter function which returns product details given a product id.
    function getProduct(uint _id) public view returns(uint, string memory, string memory, uint, ProductCondition, address, string memory, string memory, address) {
        Product memory product = stores[productIdinStore[_id]][_id];
        return (product.id, product.name, product.category, product.price, product.condition, product.buyer, product.descLink, product.imgLink, product.seller);
    }

    // Buy a product using product id.
    function buy(uint _id) payable public {
      Product memory product = stores[productIdinStore[_id]][_id];
      require(msg.value >= product.price);
      // We assigned 0x0000...000 (zero-account) as buyer value to state the
      // product is not already purchased
      require(product.buyer == address(0));
      product.buyer = msg.sender;
      stores[productIdinStore[_id]][_id] = product;
      Escrow escrow = (new Escrow).value(msg.value)(_id, msg.sender, productIdinStore[_id], arbiter);
      productEscrow[_id] = address(escrow);
      emit LogCurrentAccount(msg.sender);
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
