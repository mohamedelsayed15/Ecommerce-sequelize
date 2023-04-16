const Product = require('../models/product')
const {Op}  = require('sequelize')
const Cart = require('../models/cart')
const { User } = require('../models/user')
const { validationResult } = require('express-validator')

exports.getProducts = async (req, res) => {
    try {

        const products = await req.user.getProducts()

        res.render('admin/my-products.ejs', {
            products,
            pageTitle: 'My Products',
            user:req.user
        })

    } catch (e) { 
        console.log(e)
        res.send("error")
    }
}

exports.browseProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id)

        res.render('shop/product-detail.ejs', {
            pageTitle: product.title,
            product
        })

    } catch (e) { 
        res.send(e)
    }
}

exports.getEditProduct = async (req, res) => { 
    try {

        const product = await req.user.getProducts({ where: { id: req.params.id } })

        if (product.length < 1) { 
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
    }
}

exports.postEditProduct = async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) { 
            return res.render('admin/edit-product.ejs',{
                    pageTitle: 'Sell Product',
                    user: req.user,
                    errorMessage:errors.array()[0].msg,
                    product: {
                        title: req.body.title,
                        description: req.body.description,
                        price: req.body.price,
                        image_url:req.body.image_url
                    }   
                })
            }

        let value = req.body

        const product = await Product.findByPk(req.params.id)

        if (req.user.id !== product.userId) { return res.status(403).send() }

        const updates = Object.keys(value)

        console.log(updates)

        updates.forEach(update => product[update] = value[update])

        await product.save()

        res.redirect('/') 
    }
    catch (e) { 
        res.send(e)
    }
}

exports.deleteProduct = async (req, res) => {
    try {

        const product = await Product.findByPk(req.params.id)

        //if (req.user.id !== product.userId) { return res.status(403).send()}

        await product.destroy()

        res.redirect('admin/my-products')

    } catch (e) { 
        res.send(e)
    }
}
exports.getAddProduct = async (req, res) => { 
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
    }
}

exports.postAddProduct = async (req, res) => {
    try {
        const errors = validationResult(req)
        console.log(errors)
        if (!errors.isEmpty()) { 
            return res.render('admin/sell-product.ejs',{
                    pageTitle: 'Sell Product',
                    user: req.user,
                    errorMessage:errors.array()[0].msg,
                    pastInput: {
                        title: req.body.title,
                        description: req.body.description,
                        price: req.body.price,
                        image_url:req.body.image_url
                    }})
        }

        await req.user.createProduct({//auto save  //auto fill for id
            title: req.body.title,
            description:req.body.description,
            price:req.body.price,
            image_url: req.body.image_url
        })

        res.redirect('/')

    } catch (e) { 
        console.log(e)
        res.send("missing information")
    }
}
