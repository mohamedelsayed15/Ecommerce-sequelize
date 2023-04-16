const express = require('express')
const router = express.Router()
const productsController = require('../controllers/products')
const auth = require('../middleware/auth')
const { body } = require('express-validator')

router.get('/find-all',auth, productsController.getProducts)

router.get('/my-products',auth,productsController.getProducts)

router.get('/sell-product' ,auth,productsController.getAddProduct)

router.post('/sell-product' ,[

    body('title')
        .trim()
        .custom((value, { req }) => { 
            if (value.length < 10) { 
                throw new Error("name cant be less than 10 characters")
            }
            if (value.length > 200) { 
                throw new Error('name cant be more than 200 characters')
            }
            return true
        }),

    body('price')
    .isFloat()
    .withMessage('price has to be a decimal value example: 8.99'),

    body('image_url')
        .isURL()
        .withMessage('enter a valid url'),

    body('description')
        .custom((value, { req }) => { 
            if (value.length < 50) { 
                throw new Error("description cant be less than 50 characters")
            }
            if (value.length > 1500) { 
                throw new Error('description cant be more than 1500 characters')
            }
            return true
        }),
    
],auth, productsController.postAddProduct)

router.get('/edit-product/:id', auth, productsController.getEditProduct)

router.post('/edit-product/:id',[

    body('title')
        .trim()
        .custom((value, { req }) => { 
            if (value.length < 10) { 
                throw new Error("name cant be less than 10 characters")
            }
            if (value.length > 200) { 
                throw new Error('name cant be more than 200 characters')
            }
            return true
        }),

    body('price')
    .isFloat()
    .withMessage('price has to be a decimal value example: 8.99'),

    body('image_url')
        .isURL()
        .withMessage('enter a valid url'),

    body('description')
        .custom((value, { req }) => { 
            if (value.length < 50) { 
                throw new Error("description cant be less than 50 characters")
            }
            if (value.length > 1500) { 
                throw new Error('description cant be more than 1500 characters')
            }
            return true
        }),
    
],auth,  productsController.postEditProduct)

router.post('/delete-product/:id',auth, productsController.deleteProduct)

module.exports = router