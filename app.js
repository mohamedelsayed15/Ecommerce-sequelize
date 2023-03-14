const express = require('express')
const sequelize = require('./util/mysql')
const Product = require('./models/product')
const { User } = require('./models/user')
const { Token } = require('./models/user')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const userRoutes = require('./routes/user')
const app = express()
//parser //json data limiter
app.use(express.json({ limit: '1kb' }))

app.use('/admin',adminRoutes)
app.use('/shop', shopRoutes)
app.use('/user', userRoutes)
//404
app.use('/*', (req, res) => { 
    try {

        res.status(404).send("E-Commerce By Mohamed Elsayed")

    } catch(e){}
})
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product)
Token.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Token)
sequelize.sync({force:true})//{force : true}//during development only
//listener
app.listen(3000, () => { 
    console.log(`server is up on 3000`)
})
