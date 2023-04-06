const jwt = require('jsonwebtoken')
const { User } = require('../models/user')

//==========================================
const auth = async (req, res, next) => { 
    try {
        // const headerToken = req.header('Authorization').replace('Bearer ', '')

        // const decoded = await jwt.verify(headerToken, process.env.JWT)

        // const user= await User.findByPk(decoded.id)

        // if (!user) {throw new Error()}

        // const tokens = await user.getTokens()

        // if (!tokens.some(token => token.token === headerToken)) { throw new Error() }

        // req.token = headerToken

        // req.user = user

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
