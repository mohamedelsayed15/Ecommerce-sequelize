const Product = require('../models/product')
const {Op}  = require('sequelize')
const Cart = require('../models/cart')

exports.getProducts = async (req, res) => {
    try {

        const products = await Product.findAll({
            where: {
                price: {
                    [Op.lt]: 60
                }
            }
        })

        res.send(products)

    } catch (e) { 
        console.log(e)
        res.send("error")
    }
}

exports.findById = async (req, res) => {
    try {

        const product = await Product.findByPk(req.params.id)

        res.send(product)

    } catch (e) { 
        res.send(e)
    }
}

exports.changePrice = async (req, res) => {
    try {

        const product = await Product.findByPk(req.params.id)

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
            
        await product.destroy()

        res.send(product)

    } catch (e) { 
        res.send(e)
    }
}

exports.addProduct = async (req, res) => {
    try {
        if (!req.body.tittle ||
            !req.body.description ||
            !req.body.price ||
            !req.body.image
        ) { return res.send("invalid") }

        const product = await Product.create({
            tittle: req.body.tittle,
            description:req.body.description,
            price:req.body.price,
            image_url:req.body.image
        })

        await product.save()

        res.send(product)

    } catch (e) { 
        console.log(e)
        res.send("missing information")
    }
}