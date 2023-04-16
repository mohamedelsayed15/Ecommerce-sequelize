const { User } = require('../models/user')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const Product =require('../models/product')
const { validationResult } = require('express-validator/check')
const {
    welcomeEmail,
    sendVerificationPassword,
} = require('../email/sg')

exports.getSignup = async (req, res) => { 
    try {

        res.render('user/signup.ejs', {
            pageTitle: 'E-commerce Sign Up',
            errorMessage: '',
            pastInput: {
                email: "",
                password: "",
                name: "",
                confirmPassword:""
            }
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
                errorMessage: errors.array()[0].msg,
                pastInput: {
                    email: req.body.email,
                    password: req.body.password,
                    name: req.body.name,
                    confirmPassword:req.body.confirmPassword
                }
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

        res.render('user/login.ejs', {
            pageTitle: 'E-commerce Login',
            errorMessage: '',
            pastInput: {
                email: '',
                password: ''
            }
        })
    } catch (e) {
        console.log(e)
    }
}
//login
exports.postLogin = async (req, res) => { 
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            console.log(errors.array())
            return res.status(422).render('user/login.ejs', {//422 invalid input
                pageTitle: 'E-commerce Sign Up',
                errorMessage: errors.array()[0].msg,
                pastInput: {
                    email: req.body.email,
                    password: req.body.password
                }
            })
        }

        // fetching user
        const user = await User.findOne({
            where: {
                email: req.body.email
            }})

        if (!user) {
            return res.status(422).render('user/login.ejs', {//422 invalid input
                pageTitle: 'E-commerce Sign Up',
                errorMessage: "couldn't find user",
                pastInput: {
                    email: req.body.email,
                    password: req.body.password
                }
            })
        }

        //compare hashed password

        const compared = await bcrypt.compare(req.body.password, user.password)

        if (compared === false) {
            return res.status(422).render('user/login.ejs', {//422 invalid input
                pageTitle: 'E-commerce Sign Up',
                errorMessage: "couldn't find user",
                pastInput: {
                    email: req.body.email,
                    password: req.body.password
                }
            })
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

        res.render('user/forgot-password.ejs', {
            pageTitle: 'Trader',
            errorMessage: '',
            pastInput: {
                email:''
            }
        })
    } catch (e) {
        console.log(e)
    }
}

exports.postForgotPassword = async (req, res) => { 
    try {
        const errors = validationResult(req)

        console.log(errors)

        console.log(req.body.email)

        if (!errors.isEmpty()) {
            return res.render('user/forgot-password.ejs', {
                pageTitle: 'Trader',
                errorMessage: errors.array()[0].msg,
                pastInput: {
                    email:req.body.email
                }
            })
        }

        const user = await User.findOne({ where: { email: req.body.email } })

        if (!user) {
            return res.redirect('/');
        }

        const buffer = await crypto.randomBytes(32)
        const token = buffer.toString('hex')


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
        console.log(user)
        if (!user) { 
            return res.redirect('/')
        }

        res.render('user/reset-password.ejs', {
            pageTitle: 'Trader',
            errorMessage: '',
            userId: user.id,
            token: req.params.token,
            pastInput: {
                password: '',
                confirmPassword:''
            }
        })
    } catch (e) {
        console.log(e)
    }
}

exports.postResetPassword = async (req, res) => { 
    try {

        const errors = validationResult(req)

        console.log(errors)

        if (!errors.isEmpty()) {
            return res.render('user/reset-password.ejs', {
                pageTitle: 'Trader',
                errorMessage: errors.array()[0].msg,
                userId: req.body.id,
                token: req.body.token,
                pastInput: {
                    password: req.body.password,
                    confirmPassword:req.body.confirmPassword
                }
            })
        }

        const user = await User.findByPk(req.body.id)

        if (!user){
            return res.redirect('/')
        }

        if (user.resetToken !== req.body.token || user.resetTokenExpiration < Date.now() ) { 
            return res.redirect('/')
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

exports.addEditCommentToProduct = async (req, res) => {
    try { 

        //validate input before this

        const product = await Product.findByPk(req.params.productId)

        let found = false
        let index = -1

        for (let i = 0; i < product.comments.length; i++) {
            if (product.comments[i].userId === req.user.id) {
                found = true
                index = i
            }
        }
        if (found === true) {

            product.comments[index].comment = req.body.comment
            product.comments[index].rating = req.body.rate

        } else { 

            product.comments.push({
                text: req.body.comment,
                userId: req.user.id,
                rating: req.body.rate
            })

        }

        await product.save()

        res.redirect(`/product/${req.params.productId}`)

    } catch (e) { 
        console.log(e)
    }
}
exports.deleteComment = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.productId)

        const comments = product.comments.filter(comment => { 
            if (comment.userId !== req.user.id) { 
                return comment
            }
        })

        product.comments = comments

        await product.save()

    } catch (e) { 
        console.log(e)
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