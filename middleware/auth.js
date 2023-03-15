const jwt = require('jsonwebtoken')
const { User } = require('../models/user')
const { Token } = require('../models/user')

//==========================================
const auth = async (req, res, next) => { 
    try {
        const headerToken = req.header('Authorization').replace('Bearer ', '')

        const decoded = jwt.verify(headerToken, process.env.JWT)

        const user = await User.findByPk(decoded.id)

        if (!user) {throw new Error()}

        const tokens = await user.getTokens()

        if (!tokens.some(token => token.token === headerToken)) { throw new Error() }

        req.token = headerToken 

        req.user = user

        next()

    } catch (e) {  
        console.log(e)
        res.status(401).send({Error : "Your not authenticated"})
    }
}
module.exports = auth