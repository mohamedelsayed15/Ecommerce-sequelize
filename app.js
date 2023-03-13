const express = require('express')
const sequelize = require('./util/mysql')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const app = express();
//parser //json data limiter
app.use(express.json({ limit: '1kb' }))
sequelize.sync()

app.use('/admin',adminRoutes)
app.use('/shop', shopRoutes)

//404
app.use('/*', (req, res) => { 
    try {

        res.status(404).send("E-Commerce By Mohamed Elsayed")

    } catch(e){}
})
//listener
app.listen(3000, () => { 
    console.log(`server is up on 3000`)
})
