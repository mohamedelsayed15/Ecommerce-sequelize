const Product = require('../models/product')
const { Order, OrderItem } = require('../models/order')
const { User } = require('../models/user')



//========================================================

exports.getCart = async (req, res) => { 
    try {req.user = await User.findOne({ where: {email:'mo.elsayed@gmail.com' } })

        const cart = await req.user.getCart()

        const cartItems = await cart.getCartItems()

        let products = await cart.getProducts()

        console.log(products[0].toJSON())

        let subtotal = 0;


        for (let i = 0; i < products.length; i++) {
            subtotal+= products[i].price * products[i].cartItem.quantity
            
        }
        console.log(subtotal)

        res.render('cart.ejs', {
            pageTitle: 'Cart',
            products : cartItems
        })

    } catch (e) { 
        res.send(e)
    }
}
exports.postCart = async (req, res) => { 
    try {
        console.log('sdadasdas \n sadasdad')
        
        let user = await User.findByPk(13)

        req.user = user
        
        console.log(req.user)

        const cart = await req.user.getCart()

        const product = await Product.findByPk(req.params.id)

        console.log(product)


        const cartItem = await cart.getProducts({ where: { id: req.params.id } })

        if (cartItem[0]) {
            cartItem[0].cartItem.quantity += 1
            await cartItem[0].cartItem.save()
        } else { 
            await cart.addProduct(product, { through: { quantity: 1 } })
        }
        res.redirect('/shop/cart')
    } catch (e) { 
        res.send(e)
    }
}
exports.deleteProductFromCart = async (req, res) => { 
    try {req.user = await User.findOne({ where: {email:'mo.elsayed@gmail.com' } })

        let cart = await req.user.getCart()

        let products = await cart.getProducts({ where: { id: req.params.id } })
    
        console.log(products[0].cartItem.toJSON())

        await products[0].cartItem.destroy()

    res.send()

    } catch (e) { 
        console.log(e)
    }
}
exports.orderCart = async (req, res) => { 
    try {req.user = await User.findOne({ where: {email:'mo.elsayed@gmail.com' } })

        console.log('dsadasds\nsdad\n\ndasdasd\n')

        const cart = await req.user.getCart()

        const cartItems = await cart.getProducts()

        console.log(cartItems[0].toJSON())

        const order = await req.user.createOrder()

        //for (let i = 0; i < cartProducts.length; i++) {
            //await order.addProduct(cartProducts[i], { through: {quantity:cartProducts[i].cartItem.quantity} })
        //}
        const orderItems = cartItems.map(item => { 
            return {
                quantity: item.cartItem.quantity,
                productId: item.cartItem.productId,
                orderId:  order.id
            }
        })
        await OrderItem.bulkCreate(orderItems)

        await cart.setProducts(null)

        res.send("orderItems")

    } catch (e) { 
        console.log(e)
    }
}
exports.getOrders = async (req, res) => {
    try {req.user = await User.findOne({ where: {email:'mo.elsayed@gmail.com' } })

        const orders = await req.user.getOrders({ include: 'products' })

        console.log(orders[0].toJSON())

        res.send(orders)

    } catch (e) { 
        console.log(e)
    }
}
