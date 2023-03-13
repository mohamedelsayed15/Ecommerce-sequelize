const Cart = require('../models/cart')
const Product = require('../models/product')




module.exports.postCart = async (req, res) => { 

    const product = await Product.findById(req.params.id)

    await Cart.addProduct(product.id, product.price)
    res.send()

}
module.exports.deleteProductFromCart = async (req, res) => { 

    await Cart.deleteProduct(req.params.id, req.body.price)

    res.send()
}