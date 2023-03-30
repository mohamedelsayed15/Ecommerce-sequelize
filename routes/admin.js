const express = require('express')
const router = express.Router()
const productsController = require('../controllers/products')
const auth = require('../middleware/auth')

router.get('/find-all',auth, productsController.getProducts)

router.get('/find-by-id/:id', auth, productsController.findByPk)

router.get('/sell-product' ,productsController.getAddProduct)

router.post('/sell-product', productsController.postAddProduct)



router.get('/edit-product/:id', auth, productsController.changePrice)

router.post('/edit-product/:id', auth, productsController.changePrice)

router.delete('/delete-product/:id', auth,productsController.deleteProduct)

module.exports = router