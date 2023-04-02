const express = require('express')
const productsController = require('../controllers/products');
const shopController = require('../controllers/shop');
const auth = require('../middleware/auth');
const router = express.Router()


router.get('/cart', shopController.getCart)

router.post('/cart/add-to-cart/:id', shopController.postCart)

router.post('/cart/minus-cart-item/:id' ,shopController.minusCartItem)

router.post('/cart/delete-from-cart/:id' ,shopController.deleteProductFromCart)

router.get('/order-cart',shopController.orderCart)

router.get('/get-orders',shopController.getOrders)


module.exports = router