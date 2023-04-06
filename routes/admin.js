const express = require('express')
const router = express.Router()
const productsController = require('../controllers/products')
const auth = require('../middleware/auth')

router.get('/find-all',auth, productsController.getProducts)

//router.get('/find-by-id/:id', auth, productsController.findByPk)

router.get('/my-products',auth,productsController.getProducts)

router.get('/sell-product',auth,productsController.getAddProduct)

router.post('/sell-product',auth, productsController.postAddProduct)

router.get('/edit-product/:id', auth, productsController.getEditProduct)

router.post('/edit-product/:id',auth,  productsController.postEditProduct)

router.get('/delete-product/:id',auth, productsController.deleteProduct)

module.exports = router