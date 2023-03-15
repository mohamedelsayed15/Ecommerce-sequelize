const { Cart,CartItem } = require('../models/cart')
const Product = require('../models/product')



module.exports.getCart = async (req, res) => { 
    try {

        const cart = await req.user.getCart()

        const cartItems = await cart.getCartItems()

        res.send({ cart ,cartItems})
    } catch (e) { 
        res.send(e)
    }

}
module.exports.postCart = async (req, res) => { 
    try {

        const cart = await req.user.getCart()

        const product = await Product.findByPk(req.params.id)

        const cartItem = await cart.getProducts({ where: { id: req.params.id } })

        if (cartItem[0]) {
            cartItem[0].cartItem.quantity += 1
            await cartItem[0].cartItem.save()
        } else { 
            await cart.addProduct(product, { through: { quantity: 1 } })
        }
        res.send()
    } catch (e) { 
        res.send(e)
    }
}
module.exports.deleteProductFromCart = async (req, res) => { 
    try {

        let cart = await req.user.getCart()

        let products = await cart.getProducts({ where: { id: req.params.id } })
    
        console.log(products[0].cartItem.toJSON())

        await products[0].cartItem.destroy()

    res.send()

    } catch (e) { 
        console.log(e)
    }
}