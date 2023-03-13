const express = require('express')
const productsController = require('../controllers/products');
const shopController = require('../controllers/shop');
const router = express.Router()

router.get('/', productsController.getProducts)

router.get('/cart/:id', shopController.postCart)

router.delete('/cart/:id', shopController.deleteProductFromCart)


module.exports = router