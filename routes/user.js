const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const auth = require('../middleware/auth')
const { body } = require('express-validator')
const { User } = require('../models/user')

// create user routes
router.get('/create-user', userController.getSignup)

router.post('/create-user',
    [
    body('email')
    .isEmail()
    .withMessage('enter a valid email')
    .custom(async (value, { req }) => { 
        const regex = /^(?!.*@gmail\.com$).+@.+\..+$/
        const isNotGmail = regex.test(value)
        const findUser = await User.findOne({ where: { email: req.body.email } })
        if (isNotGmail) {
            throw new Error(' enter a gmail address')
        }
        if (findUser) {
            throw new Error('a user with this email already exists')
        }
        return true
    }),
    //password validation
    body('password')
        .isLength({ min: 6})// shouldn't expose the range of passwords
        .withMessage('password is too short'),
    //confirm password validation
    body('confirmPassword',
        'password and confirm password are not match')
        .custom((value, { req }) => { 
            if (value !== req.body.password) {
                throw new Error()
            }
            return true
        })

    ], userController.postSignup)
    

//login user routes
router.get('/login-user', userController.getLogin)

router.post('/login-user', userController.postLogin)


//forgot password routes
router.get('/forgot-password', userController.getForgotPassword)

router.post('/forgot-password', userController.postForgotPassword)

//reset password routes
router.get('/reset-password/:token', userController.getResetPassword)

router.post('/reset-password', userController.postResetPassword)

//logout user route
router.get('/logout-user', auth ,userController.postLogout)
//delete user route
router.post('/delete-user', auth,userController.deleteUser)


module.exports=router