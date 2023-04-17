const jwt = require('jsonwebtoken')
const { User } = require('../models/user')

//==========================================
const auth = async (req, res, next) => { 
    try {

        if (!req.session.user ) { 
            return res.redirect('/user/login-user')
        }

        const user = await User.findByPk(req.session.user.id)

        if (!user) {
            return next()
        }

        req.user = user

        next()

    } catch (e) {  
        console.log(e)
        const error = new Error(e)
        error.httpStatusCode = 500
        return next(error)
    }
}

module.exports = auth
