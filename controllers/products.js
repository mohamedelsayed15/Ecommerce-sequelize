const Product = require('../models/product')
const {Op}  = require('sequelize')
const Cart = require('../models/cart')
const { User } = require('../models/user')

exports.getProducts = async (req, res) => {
    try {

        const products = await req.user.getProducts()

        res.send(products)

    } catch (e) { 
        console.log(e)
        res.send("error")
    }
}

exports.findByPk = async (req, res) => {
    try {

        const product = await Product.findByPk(req.params.id)

        if (req.user.id !== product.userId) { return res.status(403).send()}

        res.send(product)

    } catch (e) { 
        res.send(e)
    }
}

exports.changePrice = async (req, res) => {
    try {

        const product = await Product.findByPk(req.params.id)

        if (req.user.id !== product.userId) { return res.status(403).send()}

        product.price = req.body.price

        await product.save()

        res.send(product)
    }
    catch (e) { 
        res.send(e)
    }
}

exports.deleteProduct = async (req, res) => {
    try {

        const product = await Product.findByPk(req.params.id)

        if (req.user.id !== product.userId) { return res.status(403).send()}

        await product.destroy()

        res.send(product)

    } catch (e) { 
        res.send(e)
    }
}
exports.getAddProduct = async (req,res) => { 
    res.render('sell-product.ejs', {pageTitle:'Sell Product'})
}

exports.postAddProduct = async (req, res) => {
    try {
        console.log(req.params.title)
        console.log(req.body)
        if (!req.body.title ||
            !req.body.description ||
            !req.body.price ||
            !req.body.image
        ) { return res.send("invalid") }

        //await req.user.createProduct()   method created by sequelize when relationships are set

        const product = await req.user.createProduct({//auto save  //auto fill for id
            tittle: req.body.tittle,
            description:req.body.description,
            price:req.body.price,
            image_url: req.body.image
        })

        res.send(product)

    } catch (e) { 
        res.send("missing information")
    }
}