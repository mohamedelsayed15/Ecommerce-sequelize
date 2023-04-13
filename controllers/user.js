const { User } = require('../models/user')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const { validationResult } = require('express-validator/check')
const {
    welcomeEmail,
    sendVerificationPassword,
} = require('../email/sg')

exports.getSignup = async (req, res) => { 
    try {
        let message = req.flash('signup')

        console.log(message)

        if (message.length > 0) {
            message = message[0]
        } else {
            message = null;
        }
        res.render('user/signup.ejs', {
            pageTitle: 'E-commerce Sign Up',
            errorMessage: message
        })
    } catch (e) { 
        console.log(e)
    }
}
exports.postSignup = async (req, res) => { 
    try { 
        const errors = validationResult(req)

        if (!errors.isEmpty()) { 
            console.log(errors.array())
            return res.status(422).render('user/signup.ejs', {//422 invalid input
                pageTitle: 'E-commerce Sign Up',
                errorMessage: errors.array()[0].msg
            })
        }

        

        let user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        user.password = ''

        req.session.isLoggedIn = true

        req.session.user = user

        await Promise.all([
            user.createCart(),
            req.session.save()
        ])

        welcomeEmail(user.email,user.name)

        setTimeout(() => {
            res.redirect('/')
        },1000)

    } catch (e) { 
        console.log(e)
        if (e.errors) { return res.status(409).send("account with this email already exists") }
        res.send(e)
    }
}

exports.getLogin = async (req, res) => {
    try {
        let message = req.flash('login')

        console.log(message)

        if (message.length > 0) {
            message = message[0]
        } else {
            message = null;
        }
        
        res.render('user/login.ejs', {
            pageTitle: 'E-commerce Login',
            errorMessage: message
        })
    } catch (e) {
        console.log(e)
    }
}
//login
exports.postLogin = async (req, res) => { 
    try {

        // fetching user
        const user = await User.findOne({
            where: {
                email: req.body.email
            }})

        if (!user) {
            await req.flash('login', `couldn't find user`)
            return setTimeout(() => {
                res.redirect('/user/login-user')
            }, 2000)
        }

        //compare hashed password

        const compared = await bcrypt.compare(req.body.password, user.password)

        if (compared === false) {
            await req.flash('login', `couldn't find user`)
            return setTimeout(() => {
                res.redirect('/user/login-user')
            }, 2000)
        }

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


exports.getForgotPassword = async (req, res) => {
    try {
        let message = req.flash('reset')

        console.log(message)

        if (message.length > 0) {
            message = message[0]
        } else {
            message = null;
        }
        
        res.render('user/forgot-password.ejs', {
            pageTitle: 'Trader Login',
            errorMessage: message
        })
    } catch (e) {
        console.log(e)
    }
}
//login
exports.postForgotPassword = async (req, res) => { 
    try {

        const user = await User.findOne({ where: { email: req.body.email } })

        if (!user){
            req.flash('reset', `couldn't find user`)
            return res.redirect('/user/forgot-password')
        }

        const buffer = await crypto.randomBytes(32)
        const token = buffer.toString('hex')

        console.log(token)

        user.resetToken = token
        user.resetTokenExpiration = Date.now() + 3600000;//1000*60*60 // 1 hr

        await user.save()

        sendVerificationPassword(user.email,user.name,token)

        res.redirect('/')

    } catch (e) { 
        console.log(e)
        res.redirect('/user/forgot-password')
    }
}

exports.getResetPassword = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                resetToken: req.params.token,
                resetTokenExpiration:{
                    [Op.gt]: Date.now()
                }
            }
        })

        if (!user) { 
            res.redirect('/')
        }

        let message = req.flash('reset')

        console.log(message)

        if (message.length > 0) {
            message = message[0]
        } else {
            message = null;
        }

        res.render('user/reset-password.ejs', {
            pageTitle: 'Trader Login',
            errorMessage: message,
            userId: user.id,
            token : req.params.token
        })
    } catch (e) {
        console.log(e)
    }
}
//login
exports.postResetPassword = async (req, res) => { 
    try {

        const user = await User.findByPk(req.body.id)

        if (user.resetToken !== req.body.token || user.resetTokenExpiration < Date.now() ) { 
            req.flash('reset', `couldn't find user`)
            return res.redirect('/')
        }

        if (!user){
            req.flash('reset', `couldn't find user`)
            return res.redirect('/user/forgot-password')
        }

        user.password = req.body.password

        user.resetToken = null

        user.resetTokenExpiration = null

        await user.save()

        res.redirect('/')

    } catch (e) { 
        console.log(e)
        res.redirect('/user/forgot-password')
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