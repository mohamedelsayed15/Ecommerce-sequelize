const Product = require('../models/product')
const {Op}  = require('sequelize')
const Cart = require('../models/cart')
const { User } = require('../models/user')

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
            product:product[0],
            user:req.user
        })
    } catch (e) { 
        console.log(e)
    }
}

exports.postEditProduct = async (req, res) => {
    try {
        /*
            validation with joi
        */
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
            user:req.user
            })
    } catch (e) { 
        console.log(e)
    }
}

exports.postAddProduct = async (req, res) => {
    try {
        if (!req.body.title ||
            !req.body.description ||
            !req.body.price ||
            !req.body.image
        ) { return res.send("invalid") }

        const product = await req.user.createProduct({//auto save  //auto fill for id
            title: req.body.title,
            description:req.body.description,
            price:req.body.price,
            image_url: req.body.image
        })

        res.redirect('/')

        //res.send(product1)

    } catch (e) { 
        console.log(e)
        res.send("missing information")
    }
}
