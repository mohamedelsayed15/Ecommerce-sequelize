const express = require('express')
const productsController = require('../controllers/products');
const shopController = require('../controllers/shop');
const auth = require('../middleware/auth');
const router = express.Router()

router.get('/', productsController.getProducts)

router.get('/cart', auth, shopController.getCart)

router.post('/cart/add-to-cart/:id', auth, shopController.postCart)

router.get('/order-cart',auth ,shopController.orderCart)

router.get('/get-orders',auth ,shopController.getOrders)

router.delete('/cart/:id',auth ,shopController.deleteProductFromCart)

module.exports = router