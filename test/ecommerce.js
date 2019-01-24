import { default as Web3} from 'web3';
const BigNumber = require('bignumber.js');
var EcommerceStore = artifacts.require('EcommerceStore')


/*
This test are covering the operations that the ecommerceStore has to do regularly:
  addProduct:
  getProduct:
  buy:
  escrowInfo:
  releaseAmountToSeller:
  refundAmountToBuyer:

The tests were written because these are important functions that are crucial to the smart contract functionality.
*/
contract('EcommerceStore', function(accounts) {
    // Contract is deployed by accounts[0]
    const buyer = accounts[1]
    const seller = accounts[2]
    const arbiter = accounts[9]
    // Only account[9] is allowed to be arbiter as account[9] is the owner of the contract.
    // Please refer: ./migrations/2_deploy_migrations.js
    const emptyAddress = '0x0000000000000000000000000000000000000000' // used as buyer for products before purchased

    before(async() => {
      const initialBalanceOfBuyer = await web3.eth.getBalance(buyer);
      const initialBalanceOfSeller = await web3.eth.getBalance(seller);
    });


    describe('Product tests', () => {


    it("Add and Get the product (2 tests)", async() => {
      const ecommercestore = await EcommerceStore.deployed()
      const productName = "A very nice book"
      const category = "Books"
      const price = web3.utils.toWei(".32".toString(), 'ether') // Replace 32.2 with desired price
      const condition = 1
      const description = "Description Link from IPFS"
      const image = "image Link from IPFS"
      await ecommercestore.addProduct( productName, category, price, condition, description , image, { from: seller })

      const product = await ecommercestore.getProduct(1)

      // Assert if Name, category, buyer, description, image, and seller match
      assert.equal(product[1], productName, 'the name of the product does not match the expected value')
      assert.equal(product[2], category, 'the category does not match the expected value')
      assert.equal(web3.utils.fromWei(product[3].toString(), "ether"), web3.utils.fromWei(price.toString(), "ether"), 'the price match failed')
      assert.equal(product[4].toString(), condition.toString(), 'the condition match failed')
      assert.equal(product[5], emptyAddress , "The buyer address should be zero")
      assert.equal(product[6], description , "the description match failed")
      assert.equal(product[7], image , "the image match failed")
      assert.equal(product[8], seller , "seller match failed")
    })

    it("Buy the product", async() => {
      const ecommercestore = await EcommerceStore.deployed()
      const product_to_buy = await ecommercestore.getProduct(1)
      const product_tx = await ecommercestore.buy(1, { value: web3.utils.toWei(".32".toString()), from: buyer } )

      const product_bought = await ecommercestore.getProduct(1)

      // Assert if Name, category, price, condition, buyer, description, image, and seller match
      assert.equal(product_to_buy[1], product_bought[1], 'the name of the product does not matche with the expected value')
      assert.equal(product_to_buy[2], product_bought[2], 'the category doesn not matche with the expected value')
      assert.equal(web3.utils.fromWei(product_to_buy[3].toString(), "ether"), web3.utils.fromWei(product_bought[3].toString(), "ether"), 'the price match failed.')
      assert.equal(product_to_buy[4].toString(), product_bought[4].toString(), 'the condition does not matche')
      assert.equal(buyer, product_bought[5], "The buyer address does not match")
      assert.equal(product_to_buy[6], product_bought[6] , "the description does not matche")
      assert.equal(product_to_buy[7], product_bought[7] , "the image does not matche")
      assert.equal(product_to_buy[8], product_bought[8] , "seller do not match")

    })



  });


  describe('Escrow tests', () => {
        before(async() => {
          // Empty
          //
           })

           it("Amount is deducted from the buyer's balance after buying and before the escrow settlement", async() => {
             const ecommercestore = await EcommerceStore.deployed()
             const initialBalanceOfBuyer = await web3.eth.getBalance(buyer);
             const productName = "Cute Cat toy"
             const category = "Toys"
             const priceEth = 1.5
             const price = web3.utils.toWei(priceEth.toString(), 'ether') // Replace 32.2 with desired price
             const condition = 1
             const description = "Description Link from IPFS"
             const image = "image Link from IPFS"
             await ecommercestore.addProduct( productName, category, price, condition, description , image, { from: seller })

             await ecommercestore.buy(2, { value: web3.utils.toWei(priceEth.toString()), from: buyer } )
             const finalBalanceOfBuyer = await web3.eth.getBalance(buyer)
             assert.ok(parseInt(finalBalanceOfBuyer) < parseInt(initialBalanceOfBuyer), "Amount is not deducted" ); // hard to be exact due to the gas usage

             /*
             const gasUsed = await receipt.receipt.gasUsed;
             const tx = await web3.eth.getTransaction(receipt.tx);
             const gasPrice = await tx.gasPrice;
             const finalBalanceOfBuyer = await web3.eth.getBalance(buyer)
             const expectedFinalBalanceOfBuyer = (parseInt(initialBalanceOfBuyer) - parseInt(price) - parseInt(gasPrice * gasUsed)).toString()
             assert.equal(expectedFinalBalanceOfBuyer.slice(0,10), finalBalanceOfBuyer.slice(0,10), 'Balances are not equal')
             */


           })

           it("Amount is not released to seller after the buyer purchased and before the escrow settlement", async() => {
           // It's good practice to keeps tests isolated. Hence adding another product.
            const ecommercestore = await EcommerceStore.deployed()


            const productName = "Tiny Phone"
            const category = "Phones"
            const priceEth = 3.3
            const price = web3.utils.toWei(priceEth.toString(), 'ether') // Replace 32.2 with desired price
            const condition = 0
            const description = "Description Link from IPFS"
            const image = "image Link from IPFS"

            const receipt = await ecommercestore.addProduct( productName, category, price, condition, description , image, { from: seller })
            const initialBalanceOfSeller = await web3.eth.getBalance(seller); //Balance after gas used for above trasnaction
            await ecommercestore.buy(3, { value: web3.utils.toWei(priceEth.toString()), from: buyer } )
            const finalBalanceOfSeller = await web3.eth.getBalance(seller);
            assert.equal(initialBalanceOfSeller, finalBalanceOfSeller, "Balances do not match")

          })

            it("Amount is released to seller after the buyer is Happy about the purchase", async() => {
            // It's good practice to keeps tests isolated. Hence adding another product.
             const ecommercestore = await EcommerceStore.deployed()
             const productName = "My Dog's can sing DVDs"
             const category = "Music"
             const priceEth = 2.3342
             const price = await web3.utils.toWei(priceEth.toString(), 'ether')

             const condition = 1
             const description = "Description Link from IPFS"
             const image = "image Link from IPFS"
             await ecommercestore.addProduct( productName, category, price, condition, description , image, { from: seller })
             const initialBalanceOfSeller = await web3.eth.getBalance(seller);

             await ecommercestore.buy(4, { value: web3.utils.toWei(priceEth.toString()), from: buyer } )
             await ecommercestore.releaseAmountToSeller(4, {from: seller}) // Seller expects his money from Escrow
             await ecommercestore.releaseAmountToSeller(4, {from: buyer}) // Buyer is happy
             const finalBalanceOfSeller = await web3.eth.getBalance(seller);
             console.log(finalBalanceOfSeller, initialBalanceOfSeller);
             await assert.ok(parseInt(finalBalanceOfSeller) > parseInt(initialBalanceOfSeller), "Amount was not released" ); // hard to be exact due to the gas usage


             /*
             // Below logic should work, but I noticed inconsistencies in the test results.

             const receipt1 = await ecommercestore.addProduct( productName, category, price, condition, description , image, { from: seller })
             const gasUsed1 = await receipt1.receipt.gasUsed;
             const tx1 = await web3.eth.getTransaction(receipt1.tx);
             const gasPrice1 = await tx1.gasPrice;
             await ecommercestore.buy(4, { value: web3.utils.toWei(priceEth.toString()), from: buyer } )
             await ecommercestore.releaseAmountToSeller(4, {from: buyer})
             const receipt2 = await ecommercestore.releaseAmountToSeller(4, {from: seller})
             const gasUsed2 = await receipt2.receipt.gasUsed;
             const tx2 = await web3.eth.getTransaction(receipt2.tx);
             const gasPrice2 = await tx2.gasPrice;
             const finalBalanceOfSeller = await web3.eth.getBalance(seller);
             const expectedFinalBalanceOfSeller = await parseInt(initialBalanceOfSeller) + parseInt(price) - parseInt(gasPrice1 * gasUsed1) - parseInt(gasPrice2 * gasUsed2)
             assert.equal(finalBalanceOfSeller, expectedFinalBalanceOfSeller, Balances do not match)
             */


             })

             it("Amount is refunded to buyer after the buyer is not happy and the seller wishes to refund  the purchase", async() => {
             // It's good practice to keeps tests isolated. Hence adding another product.
              const ecommercestore = await EcommerceStore.deployed()
              const productName = "Large Laptop"
              const category = "Computers"
              const priceEth = 1.879
              const price = await web3.utils.toWei(priceEth.toString(), 'ether')

              const condition = 1
              const description = "Description Link from IPFS"
              const image = "image Link from IPFS"
              await ecommercestore.addProduct( productName, category, price, condition, description , image, { from: seller })
              await ecommercestore.buy(5, { value: web3.utils.toWei(priceEth.toString()), from: buyer } )
              const initialBalanceOfBuyer = await web3.eth.getBalance(buyer);
              await ecommercestore.refundAmountToBuyer(5, {from: buyer}) // Buyer wants refund
              await ecommercestore.refundAmountToBuyer(5, {from: seller}) // Seller wishes to refund
              const finalBalanceOfBuyer = await web3.eth.getBalance(buyer);
              // console.log(finalBalanceOfBuyer, initialBalanceOfBuyer)
              await assert.ok(parseInt(finalBalanceOfBuyer) > parseInt(initialBalanceOfBuyer), "Balances are not right!"); // hard to be exact due to the gas usage
         });

             it("Dispute: Amount is refunded to buyer after Arbiter rules the dispute in favor of buyer.", async() => {
             // It's good practice to keeps tests isolated. Hence adding another product.
              const ecommercestore = await EcommerceStore.deployed()
              const productName = "Tiny Monalisa - Art"
              const category = "Art"
              const priceEth = 2.379
              const price = await web3.utils.toWei(priceEth.toString(), 'ether')
              const condition = 1
              const description = "Description Link from IPFS"
              const image = "image Link from IPFS"
              await ecommercestore.addProduct( productName, category, price, condition, description , image, { from: seller })
              await ecommercestore.buy(6, { value: web3.utils.toWei(priceEth.toString()), from: buyer } )
              const initialBalanceOfBuyer = await web3.eth.getBalance(buyer);
              await ecommercestore.refundAmountToBuyer(6, {from: buyer}) // Buyer wants refund
              await ecommercestore.releaseAmountToSeller(6, {from: seller}) // Seller wants his funds
              await ecommercestore.refundAmountToBuyer(6, {from: arbiter}) // Arbiter rules in the favour of buyer
              const finalBalanceOfBuyer = await web3.eth.getBalance(buyer);
              // console.log(finalBalanceOfBuyer, initialBalanceOfBuyer)
              await assert.ok(parseInt(finalBalanceOfBuyer) > parseInt(initialBalanceOfBuyer), "Balances are not right!"); // hard to be exact due to the gas usage
         });


              it("Dispute: Amount is refunded to Seller after Arbiter rules the dispute in favor of Seller.", async() => {
              // It's good practice to keeps tests isolated. Hence adding another product.
               const ecommercestore = await EcommerceStore.deployed()
               const productName = "Big Box with Stuff"
               const category = "Others"
               const priceEth = 1.384
               const price = await web3.utils.toWei(priceEth.toString(), 'ether')
               const condition = 1
               const description = "Description Link from IPFS"
               const image = "image Link from IPFS"
               await ecommercestore.addProduct( productName, category, price, condition, description , image, { from: seller })
               await ecommercestore.buy(7, { value: web3.utils.toWei(priceEth.toString()), from: buyer } )
               const initialBalanceOfSeller = await web3.eth.getBalance(seller);
               await ecommercestore.refundAmountToBuyer(7, {from: buyer}) // Buyer wants refund
               await ecommercestore.releaseAmountToSeller(7, {from: seller}) // Seller wants his funds
               await ecommercestore.releaseAmountToSeller(7, {from: arbiter}) // Arbiter rules in the favour of seller
               const finalBalanceOfSeller = await web3.eth.getBalance(seller);
               // console.log(finalBalanceOfBuyer, initialBalanceOfBuyer)
               await assert.ok(parseInt(finalBalanceOfSeller) > parseInt(initialBalanceOfSeller), "Balances are not right!"); // hard to be exact due to the gas usage
          });

 });

});
