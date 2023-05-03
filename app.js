//
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const csrf = require('csurf')
const path = require('path')
//=================  Calling Multer  =================
const upload = require('./multer/multer')
//================= DataBase linking =================
const sequelize = require('./util/mysql')
//============= Require for Relations ================
const Product = require('./models/product')
const { User } = require('./models/user')
const { Token } = require('./models/user')
const { Cart } = require('./models/cart')
const { CartItem } = require('./models/cart')
const { Order } = require('./models/order')
const { OrderItem } = require('./models/order')
//==================== Routes ======================
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const userRoutes = require('./routes/user')
//====================================================
const app = express()
const csrfProtection = csrf()
//parser
app.use(bodyParser.urlencoded({ extended: true }))
//serve css
app.use(express.static('public'))
app.use('/images',express.static(path.join(__dirname,'images')))
//parser //json data limiter
app.use(express.json({ limit: '1kb' })) 
//sets template engine
app.set('view engine', 'ejs')
//optional set default views to views
app.set('views', 'views')
//multer
app.use(upload)
//session
app.use(
    session({
        secret: "secret123",
        store: new SequelizeStore({
            db: sequelize,
            checkExpirationInterval:15 * 24 * 60 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
            expiration:5* 24 * 60 * 60 * 1000  // The maximum age (in milliseconds) of a valid session.
        }),
        resave: false, // we support the touch method so per the express-session docs this should be set to false
        saveUninitialized: false,
    })
)
app.use(csrfProtection)
//==================== Routes ======================
app.use((req, res, next) => {

    res.locals.isAuthenticated = req.session.isLoggedIn
    res.locals.csrfToken = req.csrfToken()
    next()
})
app.use('/admin',adminRoutes)
app.use('/shop', shopRoutes)
app.use('/user', userRoutes)
//main
app.get('/', async (req, res, next) => { 
    try {
        const limit = 6

        let page = +req.query.page || 1 // converting to number default value = 1

        if (!Number.isInteger(page)) { page = 1 }

        const offset = (page - 1) * limit;

        const products = await Product.findAndCountAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        })

        console.log(products.count)

        res.render('shop/shop.ejs', {
            products: products.rows,
            count: products.count,
            limit,
            page,
            pageTitle: 'Trader',
            path: '/'
        })

    } catch (e) {
        console.log(e)
        const error = new Error(e)
        error.httpStatusCode = 500
        return next(error)
    }
})
app.use((error, req, res, next) => { 
    try {
        console.log(error)
        res.render('500.ejs', {
            pageTitle: 'ERROR 500',
            isAuthenticated: false
    })
    
    } catch (e) { 

    }
})
//500
app.get('/500', (req, res, next) => { 
    try {

        res.render('500.ejs', {
            pageTitle: 'ERROR 500'
        })

    } catch (e) {
        console.log(e)
    }
})
//404
app.use('/*', (req, res, next) => { 
    try {

        res.render('ERROR-404.ejs', {
            pageTitle: 'ERROR 404'
        })

    } catch (e) {
        console.log(e)
        const error = new Error(e)
        error.httpStatusCode = 500
        return next(error)
    }
})


//=================== Relations =======================
//relation indicates that a user can handle many products 
///create /delete /update /read one to many
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product)
//user cart relationship one to one
Cart.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasOne(Cart)
//JWT tokens stored in a different table one to many
Token.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Token)


//Many to Many M:N we resolve many to many by a third table
Cart.belongsToMany(Product, { through: CartItem })// this can be a custom table or a sequelize
Product.belongsToMany(Cart, { through: CartItem })// made table by inputting text instead of table
CartItem.belongsTo(Cart, { constraints: true, onDelete: 'CASCADE' })
Cart.hasMany(CartItem)
CartItem.belongsTo(Product, { constraints: true, onDelete: 'CASCADE' })
Product.hasMany(CartItem)
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, { through: OrderItem })
Product.belongsToMany(Order, { through: OrderItem })


sequelize.sync().then(async () => {
    const user = await User.findByPk(1)
    for (let i = 0; i < 50; i++){
        await user.createProduct({
            title: 'Cubii JR2+, Under Desk Elliptical, Under Desk Bike Pedal Exerciser, Seated Elliptical, Bluetooth, Work from Home Fitness, Mini Elliptical, Cubii Exerciser for Seniors, Desk Exercise, Newest, Aqua',
            description: 'Cubii JR2+, Under Desk Elliptical, Under Desk Bike Pedal Exerciser, Seated Elliptical, Bluetooth, Work from Home Fitness, Mini Elliptical, Cubii Exerciser for Seniors, Desk Exercise, Newest, Aqua',
            price: 142.22,
            image: 'images/image-1683052298511-83007541661drpi3cYUL._AC_UL320_.jpg'
        })
    }
})//{force : true}//during development only

//=================== listener ======================
app.listen(process.env.PORT, () => { 
    console.log(`server is up on 3000`)
})
