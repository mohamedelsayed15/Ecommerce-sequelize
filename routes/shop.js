const express = require('express')
const productsController = require('../controllers/products');
const shopController = require('../controllers/shop')
const auth = require('../middleware/auth');
const router = express.Router()

router.get('/cart',auth, shopController.getCart)

router.post('/cart/add-to-cart/:id',auth, shopController.postCart)

router.post('/cart/minus-cart-item/:id',auth ,shopController.minusCartItem)

router.post('/cart/delete-from-cart/:id' ,auth,shopController.deleteProductFromCart)

router.post('/order-cart',auth,shopController.orderCart)

router.get('/orders', auth, shopController.getOrders)

//order invoice
router.get('/orders/:orderId',auth,shopController.getInvoice)

router.get('/browse-product/:id', productsController.browseProduct)


module.exports = router