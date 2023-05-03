const Product = require('../models/product')
const { Order, OrderItem } = require('../models/order')
const { User } = require('../models/user')
const path = require('path')
const fs = require('fs')
const PDFDocument = require('pdfkit')
//========================================================

exports.getCart = async (req, res , next ) => { 
    try {

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
                image :product.image,
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
        })

    } catch (e) { 
        console.log(e)
        const error = new Error(e)
        error.httpStatusCode = 500
        return next(error)
    }
}
exports.postCart = async (req, res , next ) => { 
    try {

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
        const error = new Error(e)
        error.httpStatusCode = 500
        return next(error)
    }
}
exports.minusCartItem = async (req, res , next ) => {
    try {

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
        const error = new Error(e)
        error.httpStatusCode = 500
        return next(error)
    }
}
exports.deleteProductFromCart = async (req, res , next ) => { 
    try {

        let cart = await req.user.getCart()

        //console.log(cart.toJSON())

        let products = await cart.getProducts({ where: { id: req.params.id } })

        console.log(products[0].cartItem.toJSON())

        await products[0].cartItem.destroy()

    res.redirect('/shop/cart')

    } catch (e) { 
        console.log(e)
        const error = new Error(e)
        error.httpStatusCode = 500
        return next(error)
    }
}
exports.orderCart = async (req, res , next ) => { 
    try {

        // const cart = await req.user.getCart()

        // const order = await req.user.createOrder()

        //combine 2 awaits better performance //parallel I/O

        const [cart, order] = await Promise.all([
            req.user.getCart(),
            req.user.createOrder()
        ])

        const cartItems = await cart.getProducts()

        const orderItems = cartItems.map(item => { 
            return {
                quantity: item.cartItem.quantity,
                productId: item.cartItem.productId,
                orderId:  order.id
            }
        })
        

        //for (let i = 0; i < cartProducts.length; i++) {
            //await order.addProduct(cartProducts[i], { through: {quantity:cartProducts[i].cartItem.quantity} })
        //}

        //bulk create better than create when making multiple records // parallel I/O

        // await OrderItem.bulkCreate(orderItems)

        // await cart.setProducts(null)

        await Promise.all([
            OrderItem.bulkCreate(orderItems),
            cart.setProducts(null)
        ])

        res.redirect('/shop/orders')

        console.timeEnd('myFunction')

    } catch (e) { 
        console.log(e)
        const error = new Error(e)
        error.httpStatusCode = 500
        return next(error)
    }
}

exports.getOrders = async (req, res , next ) => {
    try {

        const orders = await req.user.getOrders()

        res.render('shop/orders.ejs', {
            pageTitle: 'Orders',
            orders
        })

    } catch (e) { 
        console.log(e)
        const error = new Error(e)
        error.httpStatusCode = 500
        return next(error)
    }
}
exports.getInvoice = async (req, res, next) => { 
    try {
        const orderId = req.params.orderId
        
        const order = await Order.findByPk(orderId)

        const orderItems = await order.getProducts()

        if (!order || order.userId !== req.user.id) {
            return res.redirect('/404')
        }
        const invoiceName = 'invoice-' + orderId + '.pdf'
        const invoicePath = path.join('data', 'invoices', invoiceName)

        const pdfDoc = new PDFDocument()

        res.setHeader('Content-Type', 'application/pdf')

        res.setHeader('Content-Disposition',`inline; filename=${invoiceName}`)

        pdfDoc.pipe(fs.createWriteStream(invoicePath))// saving pdf on the server

        pdfDoc.pipe(res)//sending pdf to the client

        pdfDoc.fontSize(26).text('Trader', {// writing a single line into the pdf file
            //underline: true,
            align:'center',
        })
        pdfDoc.fontSize(16).text('\n\n')
        let total=0
        

        for (let i = 0; i < orderItems.length; i++){
            
            pdfDoc.text('Product Name : ' + orderItems[i].title)
            pdfDoc.text('\nProduct Price : $' + orderItems[i].price)
            pdfDoc.text('Product quantity : ' + orderItems[i].orderItem.quantity)
            pdfDoc.text('Product Total Price : $' +
                (orderItems[i].price * orderItems[i].orderItem.quantity))
            pdfDoc.text('\n----------------------------------------\n\n', {
                align:'center'
            })
            total += orderItems[i].price * orderItems[i].orderItem.quantity
        }

        pdfDoc.fontSize(16).text('Order Total:$ ' + total)

        pdfDoc.end()//end writing 

        /*//other code

        const order = await req.user.getOrders({where:{
            id: orderId
        }})

        if(order.length < 1){
            return res.redirect('/404')
        }
        */

        //for small files only
        //const file = await fs.promises.readFile(invoicePath)

        // reading files 

        //sending file on chunks of data instead of loading it to memory as a whole
        // const file = fs.createReadStream(invoicePath)

        // file.on('error', (error) => { 
        //     return next(error)
        // })

        // res.setHeader('Content-Type', 'application/pdf')
        // // replace inline with attachment to download the file without preview
        // res.setHeader('Content-Disposition',`inline; filename=${invoiceName}`)

        // //res.send(file)
        // file.pipe(res)

    } catch (e) { 
        console.log(e)
        const error = new Error(e)
        error.httpStatusCode = 500
        return next(error)
    }
}