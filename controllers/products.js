const Product = require('../models/product')
const {Op}  = require('sequelize')
const Cart = require('../models/cart')
const { User } = require('../models/user')
const { validationResult } = require('express-validator')
const { deleteFile } = require('../util/file') 



exports.getAddProduct = async (req, res , next ) => { 
    try {
        res.render('admin/sell-product.ejs',{
            pageTitle: 'Sell Product',
            user: req.user,
            errorMessage:'',
            pastInput: {
                title: '',
                description: '',
                price: '',
                image_url:''
            }
            })
    } catch (e) { 
        console.log(e)
        const error = new Error(e)
        error.httpStatusCode = 500
        return next(error)
    }
}

exports.postAddProduct = async (req, res , next ) => {
    try {
        const errors = validationResult(req)

        const image = req.file

        if (!image) { 
            return res.render('admin/sell-product.ejs',{
                pageTitle: 'Sell Product',
                user: req.user,
                errorMessage:'Attached file is not an image',
                pastInput: {
                    title: req.body.title,
                    description: req.body.description,
                    price: req.body.price
            }
        })
        }
        console.log(image.path)
        if (!errors.isEmpty()) { 
            return res.render('admin/sell-product.ejs',{
                    pageTitle: 'Sell Product',
                    user: req.user,
                    errorMessage:errors.array()[0].msg,
                    pastInput: {
                        title: req.body.title,
                        description: req.body.description,
                        price: req.body.price
                }
            })
        }

        await req.user.createProduct({//auto save  //auto fill for id
            title: req.body.title,
            description:req.body.description,
            price: req.body.price,
            image :image.path
        })

        res.redirect('/')

    } catch (e) { 
        console.log(e)
        const error = new Error(e)
        error.httpStatusCode = 500
        return next(error)
    }
}
exports.getProducts = async (req, res , next ) => {
    try {

        const products = await req.user.getProducts()

        res.render('admin/my-products.ejs', {
            products,
            pageTitle: 'My Products',
            user:req.user
        })

    } catch (e) { 
        console.log(e)
        const error = new Error(e)
        error.httpStatusCode = 500
        return next(error)
    }
}
exports.browseProduct = async (req, res , next ) => {
    try {
        const product = await Product.findByPk(req.params.id)

        res.render('shop/product-detail.ejs', {
            pageTitle: product.title,
            product
        })

    } catch (e) { 
        console.log(e)
        const error = new Error(e)
        error.httpStatusCode = 500
        return next(error)
    }
}

exports.getEditProduct = async (req, res , next ) => { 
    try {

        const product = await req.user.getProducts({ where: { id: req.params.id } })

        if (product.length === 0) { 
            res.redirect('/404')
        }

        res.render('admin/edit-product.ejs', {
            pageTitle: 'Edit Product',
            product: product[0],
            errorMessage:'',
            user:req.user
        })
    } catch (e) { 
        console.log(e)
        const error = new Error(e)
        error.httpStatusCode = 500
        return next(error)
    }
}

exports.postEditProduct = async (req, res , next ) => {
    try {
        const errors = validationResult(req)
        const image = req.file
        if (!errors.isEmpty()) { 
            return res.render('admin/edit-product.ejs',{
                        pageTitle: 'Sell Product',
                        user: req.user,
                        errorMessage:errors.array()[0].msg,
                        product: {
                            id:req.body.id,
                            title: req.body.title,
                            description: req.body.description,
                            price: req.body.price,
                        }   
                    })
                }

        console.log(image.path)
        
        
        const product = await Product.findByPk(req.body.id)

        if (req.user.id !== product.userId) { return res.status(403).send() }

        const updates = Object.keys(req.body)

        updates.forEach(update => product[update] = req.body[update])

        if (image.path) { 
            deleteFile(product.image)//from file.js in util
            product.image = image.path
        }

        await product.save()

        res.redirect('/') 
    }
    catch (e) { 
        console.log(e)
        const error = new Error(e)
        error.httpStatusCode = 500
        return next(error)
    }
}

exports.deleteProduct = async (req, res , next ) => {
    try {

        const product = await Product.findByPk(req.params.id)

        if (req.user.id !== product.userId) { return res.status(403).send() }

        deleteFile(product.image)//from file.js in util

        await product.destroy()

        res.redirect('/')

    } catch (e) { 
        console.log(e)
        const error = new Error(e)
        error.httpStatusCode = 500
        return next(error)
    }
}

