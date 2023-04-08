const { User } = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.getSignup = async (req, res) => { 
    let message = req.flash('signup')

        console.log(message)

        if (message.length > 0) {
            message = message[0]
        } else {
            message = null;
        }
    res.render('signup.ejs', {
        pageTitle: 'E-commerce Sign Up',
        errorMessage: message
    })
}
exports.postSignup = async (req, res) => { 
    try { 
        const findUser = await User.findOne({ email: req.body.email })
        if (findUser) {
            req.flash('signup', `user with this email already exists`)
            return res.redirect('/user/create-user')
        }
        let user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        const token = jwt.sign({ id: user.id }, process.env.JWT)

            await Promise.race([
            token,
            user.createToken({ token }),
            user.createCart()

        ])

        // await user.createToken({ token })

        // await user.createCart()

        user.password = ''

        req.session.isLoggedIn = true

        req.session.user = user

        await req.session.save()

        setTimeout(() => {
            res.redirect('/')
        },1000)
        

        //res.status(201).send({user , token})

    } catch (e) { 
        console.log(e)
        if (e.errors) { return res.status(409).send("account with this email already exists") }
        res.send(e)
    }
}

exports.getLogin = async (req, res) => { 

        let message = req.flash('login')

        console.log(message)

        if (message.length > 0) {
            message = message[0]
        } else {
            message = null;
        }
        
            res.render('login.ejs', {
                pageTitle: 'E-commerce Login',
                errorMessage: message
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

        if (!user) {
            req.flash('login',`couldn't find user`)
            return res.redirect('/user/login-user')
        }

        //compare hashed password

        const compared = await bcrypt.compare(req.body.password, user.password)

        if (compared === false) {
            req.flash('login', `couldn't find user`)
            return res.redirect('/user/login-user')
        }

        //generating jwt token

        // const tokenPromise =  jwt.sign({ id: user.id }, process.env.JWT)

        // const userTokenPromise =  user.createToken({ token:tokenPromise })

        // await Promise.all([
        //     tokenPromise,
        //     userTokenPromise
        // ])

        user.password = ''

        //res.setHeader('Set-Cookie','loggedIn=true; Max-Age=432000; path=/; httpOnly;')//5 days

        req.session.isLoggedIn = true

        req.session.user = user

        await req.session.save()

        setTimeout(() => {
            res.redirect('/')
        },1000)
        

    } catch (e) { 
        console.log(e)
        res.send(e)
    }
}
exports.postLogout = async (req, res) => {
    try {

        await req.session.destroy()

        setTimeout(() => {
            res.redirect('/')
        },1000)

    } catch (e) {
        console.log(e)
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