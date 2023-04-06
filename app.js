//
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const SequelizeStore = require("connect-session-sequelize")(session.Store);
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
app.use(bodyParser.urlencoded({ extended: true }));//parser
app.use(express.static('public'));//serve css
app.use(express.json({ limit: '1kb' })) //parser //json data limiter
app.set('view engine', 'ejs');//sets template engine
app.set('views', 'views')//optional set default views to views


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
    );
//==================== Routes ======================
app.use('/admin',adminRoutes)
app.use('/shop', shopRoutes)
app.use('/user', userRoutes)
//main
app.get('/',async (req, res) => { 
    try {
        const products = await Product.findAll()

        res.render('shop.ejs', {
            products,
            pageTitle: 'Shop',
            path: '/',
            isAuthenticated:req.session.isLoggedIn
        })

    } catch(e){}
})
//404
app.use('/*', (req, res) => { 
    try {

        res.render('ERROR-404.ejs', {
            pageTitle: 'ERROR 404',
            isAuthenticated:req.session.isLoggedIn
        })

    } catch(e){}
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


const me = async () => await sequelize.sync()//{force : true}//during development only
me()

//=================== listener ======================
app.listen(3000, () => { 
    console.log(`server is up on 3000`)
})
