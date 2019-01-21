// Import the page's CSS. Webpack will know what to do with it.

import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host:'localhost', port:'5001', protocol:'http'});

// Import our contract artifacts and turn them into usable abstractions.
import ecommerce_store_artifacts from '../../build/contracts/EcommerceStore.json'
var EcommerceStore = contract(ecommerce_store_artifacts);
var reader;

window.App = {

 start: function() {
  var self = this;

  EcommerceStore.setProvider(web3.currentProvider);

  $('#how-to-buy').html("<ul>" +
                            "<li>Click on details of the product on the home page</li>" +
                            "<li>Click 'Buy'.</li>" +
                            "<li>Verify and accept the charges on Metamask pop-up.</li>" +
                        "</ul>");

  $('#how-to-list').html("<ul>" +
                          "<li>Go to List Item from the home page</li>" +
                          "<li>Fill the form</li>" +
                          "<li>Click on 'Add Product To Store'</li>" +
                          "<li>Verify and Pay the Network and listing fees.</li>" +
                      "</ul>");

  $("#current-account").html("Current Account: " + web3.eth.accounts[0]);
  // Check whether we are on the product page. #product-details is found?
  if($("#product-details").length > 0) {
    let productId = new URLSearchParams(window.location.search).get('id');
    renderProductDetails(productId);
  } else {
    renderStore();
  }

  var fileReadResult;

  $("#product-image").change(function(event) {
    const file = event.target.files[0];
    // FileReader is used to read the contents of a Blob or File
    // More info: https://www.javascripture.com/FileReader
    reader = new window.FileReader();
    // readAsArrayBuffer: Begins reading from blob as an ArrayBuffer.
    // The result will be stored on this.result after the 'load' event fires.
    reader.readAsArrayBuffer(file);
    console.log(reader);
  });

  // Below code extracts product information from the form and puts it in a dictionary
  $("#add-item-to-store").submit(function(event) {
    const req = $("#add-item-to-store").serialize();
    console.log(req);
    // product-name=Sunglasses&product-category=Sporting%20Goods&product-price=3.6&product-condition=1
    let params = JSON.parse('{"' +req.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') +'"}');
    let decodedParams = {}
    Object.keys(params).forEach(function(v) {
      decodedParams[v] = decodeURIComponent(decodeURI(params[v]));
    });
    console.log(decodedParams);
    // {product-name: "Sunglasses", product-category: "Sporting Goods", product-price: "1.6", product-condition: "1"}
    saveProduct(decodedParams);
    event.preventDefault(); // So that the page doesn't load.
  });

  $("#buy-now").submit(function(event) {
      $("#msg").hide();
      var sendAmount = $("#buy-now-price").val();
      var productId = $("#product-id").val();
      EcommerceStore.deployed().then(function(i){
        i.buy(productId, {value: sendAmount, from: web3.eth.accounts[0] , gas: 4444000}).then( function(f){
          $("#msg").show();
          $("#msg").html("You purchased the item Successfully!");
          })
        });
        event.preventDefault();
      });

    $("#release-funds").click(function(event){
      let productId = new URLSearchParams(window.location.search).get('id');
      EcommerceStore.deployed().then(function(f) {
        $("#msg").html("Your transaction has been submitted. Please wait for conformation on the Blockchain").show();
        console.log(productId);
        f.releaseAmountToSeller(productId, {from: web3.eth.accounts[0]}).then(function(f) {
          console.log(f);
          location.reload();
        }).catch(function(e) {
            console.log(e);
        })
      });
    });

    $("#refund-funds").click(function(event){
      let productId = new URLSearchParams(window.location.search).get('id');
      EcommerceStore.deployed().then(function(f) {
        $("#msg").html("Your transaction has been submitted. Please wait for conformation on the Blockchain").show();
        console.log(productId);
        f.refundAmountToBuyer(productId, {from: web3.eth.accounts[0]}).then(function(f) {
          console.log(f);
          location.reload();
        }).catch(function(e) {
            console.log(e);
        })
      });
    });
    }
  };

  function renderProductDetails(productId) {
      EcommerceStore.deployed().then(function(f){
      f.getProduct.call(productId).then(function(p) {
        $("#product-name").html(p[1]);
        $("#product-image").html("<img width='400' src='http://localhost:8080/ipfs/"+ p[7] +"'/>");
        $("#product-price").html(priceInEth(p[3]) +" Ether");
        ipfs.cat(p[6]).then(function(file) {
          var content = file.toString();
          $("#product-desc").append("<div>"+ content + "</div>");
        })
        $("#product-id").val(p[0]);
        $("#buy-now-price").val(p[3]);
        // Hide escrow information if product is not purchased yet.
        if(p[5] == '0x0000000000000000000000000000000000000000') {
          $('#escrow-info').hide();
        } else {
          $('#buy-now').hide();
          f.escrowInfo.call(productId).then(function(i) {
            $("#current-details").html("<h4>Transactional details (updated):</h4>")
            $("#buyer").html("Buyer: "+i[0]);
            $("#seller").html("Seller: "+i[1]);
            $("#arbiter").html("Arbiter: "+i[2]);
            $("#release-count").html(i[4].toNumber());
            $("#refund-count").html(i[5].toNumber());
          });
        }
      });
    })
  }

  function saveProduct(product) {
    // 1. Upload image to IPFS and get the hash
    // 2. Upload description to IPFS and get the hash
    // 3. Pass the 2 hashes to EcommerceStore.addProduct()
    var imageId;
    var descId;
    self.reader;
    //console.log("Save Product"+self.reader);
    saveImageOnIpfs(reader).then(function(id) {
      imageId = id;
      console.log(imageId);
      saveDescOnIpfs(product["product-description"]).then(function(id) {
      descId = id;
      console.log(descId);
        EcommerceStore.deployed().then(function(f) {
          return f.addProduct(product["product-name"], product["product-category"], web3.toWei(product["product-price"], 'ether'),
              product["product-condition"], descId, imageId, {from: web3.eth.accounts[0], gas: 6009999});
            }).then(function(f) {
          alert("Product added to store!");
        });
      });
    });
  }

  function saveImageOnIpfs(reader) {
    //console.log("Save Image"+self.reader) //undefined
     return new Promise(function(resolve, reject) {
       const buffer = Buffer.from(reader.result);
       ipfs.add(buffer)
        .then((response) => {
         console.log(response)
         resolve(response[0].hash);
       }).catch((err) => {
         console.error(err)
         reject(err);
       })
     })
   }

   function saveDescOnIpfs(desc) {
     return new Promise(function(resolve, reject) {
       const descBuffer = Buffer.from(desc, 'utf-8');
       ipfs.add(descBuffer)
        .then((response) => {
          console.log(response)
          resolve(response[0].hash);
        }).catch((err) => {
          console.error(err)
          reject(err);
     })
   })
 }

  // Render products in the store
  function renderStore() {
    var instance;
    EcommerceStore.deployed().then(function(f) {
      instance = f;
      return instance.ProductIndex.call();
    }).then(function(count) {
      for(var i=1; i<= count; i++) {
        renderProduct(instance, i);
      }
    });
  }

  // Render each product details provided product index
  function renderProduct(instance, index) {
    instance.getProduct.call(index).then(function(f) {
      let node = $("<div/>");
      node.addClass("col-sm-3 text-center col-margin-bottom-1 product");
      node.append("<img width='200' src='http://localhost:8080/ipfs/"+ f[7] +"'/>");
      node.append("<div class='title'>" +f[1] + "</div>");
      node.append("<div> Price:" + priceInEth(f[3]) + " Ether" + "</div>");
      node.append("<a href='product.html?id=" + f[0] + "'>Details</div>");
      if (f[5] === '0x0000000000000000000000000000000000000000') {
        $("#product-list").append(node);
      } else {
        $("#product-purchased").append(node);
      }
    });
  }

  function priceInEth(_price) {
    return web3.fromWei(_price, 'ether');
  }

window.addEventListener('load', function() {

 // Checking if Web3 has been injected by the browser (Mist/MetaMask)
 if (typeof web3 !== 'undefined') {
  console.warn("Using web3 detected from external source. http://truffleframework.com/tutorials/truffle-and-metamask")

  // Use Mist/MetaMask's provider
  window.web3 = new Web3(web3.currentProvider);

 } else {

  console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. Remove it when live.");

  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

 }

 App.start();

});
