const { User } = require('../models/user')
const { Token } = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Cart } = require('../models/cart')
exports.signup = async (req, res) => { 
    try {

        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        await user.save()

        const token = await jwt.sign({ id: user.id.toString() }, process.env.JWT)

        await user.createToken({ token })

        await user.createCart()

        user.password = ''

        res.status(201).send({user , token})

    } catch (e) { 
        console.log(e)
        if (e.errors) { return res.status(409).send("account with this email already exists") }
        res.send(e)
    }
}
exports.login = async (req, res) => { 
    try {
        const user = await User.findOne({ where: { email: req.body.email } })

        if (!user) { return res.send("couldn't find user")}

        const compared = await bcrypt.compare(req.body.password, user.password)

        if (compared === false) { return res.send("couldn't find user") }

        const token = await jwt.sign({ id: user.id.toString() }, process.env.JWT)

        await user.createToken({ token })

        user.password = ''

        res.send({user,token})

    } catch (e) { 
        console.log(e)
        res.send(e)
    }
}

exports.deleteUser = async (req, res) => {
    try {

        await req.user.destroy()

        res.send(req.user)

    } catch (e) { 
        res.send(e)
    }
}