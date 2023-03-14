const express = require('express')
const router = express.Router()
const productsController = require('../controllers/products')
const auth = require('../middleware/auth')

router.get('/find-all',auth, productsController.getProducts)

router.get('/find-by-id/:id', auth, productsController.findByPk)

router.post('/add-product' ,auth,productsController.addProduct)

router.post('/change-price/:id', auth, productsController.changePrice)

router.delete('/delete-product/:id', auth,productsController.deleteProduct)

module.exports = router