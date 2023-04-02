const { User } = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


exports.getSignup = async (req,res) => { 
    res.render('signup.ejs', {
        pageTitle:'E-commerce Sign Up'
    })
}
exports.postSignup = async (req, res) => { 
    try { 

        let user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        const token = await jwt.sign({ id: user.id }, process.env.JWT)

        await Promise.all([
            user.createToken({ token }),
            user.createCart()
        ])

        // await user.createToken({ token })

        // await user.createCart()

        user.password = ''

        res.status(201).send({user , token})

    } catch (e) { 
        console.log(e)
        if (e.errors) { return res.status(409).send("account with this email already exists") }
        res.send(e)
    }
}
exports.getLogin = async (req,res) => { 
    res.render('login.ejs',{
        pageTitle:'E-commerce Login'
    })
}
//login
exports.postLogin = async (req, res) => { 
    try {

        //fetching user
        const user = await User.findOne({
            where: {
                email: req.body.email
            }})

        if (!user) { return res.send("couldn't find user") }

        //compare hashed password

        const compared = await bcrypt.compare(req.body.password, user.password)

        if (compared === false) { return res.send("couldn't find user") }

        //generating jwt token

        const token = await jwt.sign({ id: user.id }, process.env.JWT)

        await user.createToken({ token })

        user.password = ''

        res.send({ user, token})

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