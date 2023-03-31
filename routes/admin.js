const express = require('express')
const router = express.Router()
const productsController = require('../controllers/products')
const auth = require('../middleware/auth')

router.get('/find-all',auth, productsController.getProducts)

//router.get('/find-by-id/:id', auth, productsController.findByPk)

router.get('/my-products',productsController.getProducts)

router.get('/sell-product' ,productsController.getAddProduct)

router.post('/sell-product', productsController.postAddProduct)

router.get('/browse-product/:id', productsController.browseProduct)

router.get('/edit-product/:id',  productsController.getEditProduct)

router.post('/edit-product/:id',  productsController.postEditProduct)

router.get('/delete-product/:id', productsController.deleteProduct)

module.exports = router