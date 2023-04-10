const Product = require('../models/product')
const { Order, OrderItem } = require('../models/order')
const { User } = require('../models/user')

//========================================================

exports.getCart = async (req, res) => { 
    try {req.user = await User.findOne({ where: {email:'mo.elsayed621654@gmail.com' } })

        const cart = await req.user.getCart()

        //const cartItems = await cart.getCartItems()

        //better way

        const products = await cart.getProducts()

        //console.log(products[0].toJSON())

        let subtotal = 0;

        for (let i = 0; i < products.length; i++) {

            subtotal+= products[i].price * products[i].cartItem.quantity

        }
        //console.log(subtotal)

        let cartProducts = products.map(product => { 
            return {
                id : product.id,
                image_url :product.image_url,
                title : product.title,
                price: product.price,
                quantity : product.cartItem.quantity,
                csrfToken: req.csrfToken()
            }
        })
        //console.log(cartProducts)

        res.render('shop/cart.ejs', {
            pageTitle: 'Cart',
            products: cartProducts,
            subtotal,
            isAuthenticated:req.session.isLoggedIn,
            csrfToken: req.csrfToken()
        })

    } catch (e) { 
        console.log(e)
        res.send(e)
    }
}
exports.postCart = async (req, res) => { 
    try {

        req.user = await User.findOne({ where: {email:'mo.elsayed621654@gmail.com' } })
        
        //console.log(req.user)

        const cart = await req.user.getCart()

        const products = await cart.getProducts({ where: { id: req.params.id } })

        //console.log(product[0])

        if (products[0]) {

            products[0].cartItem.quantity += 1
            await products[0].cartItem.save()

        } else { 

            let product = await Product.findByPk(req.params.id)
            await cart.addProduct(product, { through: { quantity: 1 } })

        }
        res.redirect('/shop/cart')
    } catch (e) { 
        console.log(e)
        res.send(e)
    }
}
exports.minusCartItem = async (req, res) => {
    try {
        console.log('test \n test')

        req.user = await User.findOne({ where: {email:'mo.elsayed621654@gmail.com' } })

        const cart = await req.user.getCart()

        const product = await cart.getProducts({ where: { id: req.params.id } })

        //console.log(product[0].toJSON())

        if (product.length < 1) { 

            return res.status(400).send("error")

        }

        if (product[0].cartItem.quantity - 1 < 1) {

            await product[0].cartItem.destroy()

        } else { 
            product[0].cartItem.quantity -= 1
            await product[0].cartItem.save()
        }

        res.redirect('/shop/cart')
    } catch (e) { 
        console.log(e)
        res.status(400).send()
    }
}
exports.deleteProductFromCart = async (req, res) => { 
    try {
        req.user = await User.findOne({ where: { email: 'mo.elsayed621654@gmail.com' } })

        let cart = await req.user.getCart()

        //console.log(cart.toJSON())

        let products = await cart.getProducts({ where: { id: req.params.id } })

        //console.log(products[0].cartItem.toJSON())

        await products[0].cartItem.destroy()

    res.redirect('/shop/cart')

    } catch (e) { 
        console.log(e)
        res.status(400).send()
    }
}
exports.orderCart = async (req, res) => { 
    try {
        console.time('myFunction');
        req.user = await User.findOne({ where: { email: 'mo.elsayed621654@gmail.com' } })

        console.log('test \n test\n \n test \n')



        // const cart = await req.user.getCart()

        // const order = await req.user.createOrder()

        //combine 2 awaits better performance

        const [cart, order] = await Promise.all([
            req.user.getCart(),
            req.user.createOrder()
        ])

        const cartItems = await cart.getProducts()

        //console.log(cartItems[0].toJSON())


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
        
        // await OrderItem.bulkCreate(orderItems)

        // await cart.setProducts(null)

        await Promise.all([
            OrderItem.bulkCreate(orderItems),
            cart.setProducts(null)])

        res.send("orderItems")
        console.timeEnd('myFunction');
    } catch (e) { 
        console.log(e)
        res.status(400).send()
    }
}
exports.getOrders = async (req, res) => {
    try {

        const orders = await req.user.getOrders({ include: 'products' })

        console.log(orders[0].toJSON())

        res.send(orders)

    } catch (e) { 
        console.log(e)
        res.status(400).send()
    }
}
