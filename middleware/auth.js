const jwt = require('jsonwebtoken')
const { User } = require('../models/user')

//==========================================
const auth = async (req, res, next) => { 
    try {

        if (!req.session.isLoggedIn ) { 
            return res.redirect('/user/login-user')
        }
        const user = await User.findByPk(req.session.user.id)

        req.user = user

        next()

    } catch (e) {  
        console.log(e)
        res.status(401).redirect('/')
        //res.status(401).send({Error : "Your not authenticated"})
    }
}

module.exports = auth
