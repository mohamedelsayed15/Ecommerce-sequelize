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
        .trim()
        .withMessage('enter a valid email')
        .custom(async (value, { req }) => { 
            const findUser = await User.findOne({ where: { email: value } })
            if (findUser) {
                throw new Error('a user with this email already exists')
            }
        return true
    }),
    //password validation
    body('password')
        .isLength({ min: 6})
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

router.post('/login-user',[
    body('email')
        .isEmail()
        .trim()
        .withMessage('enter a valid email')
    ], userController.postLogin)


//forgot password routes
router.get('/forgot-password', userController.getForgotPassword)

router.post('/forgot-password',[
    body('email')
        .isEmail()
        .trim()
        .withMessage('enter a valid email')
], userController.postForgotPassword)

//reset password routes
router.get('/reset-password/:token' ,userController.getResetPassword)

router.post('/reset-password', [
    //password validation
    body('password')
        .isLength({ min: 6 })
        .withMessage('password is too short'),
    //confirm password validation
    body('confirmPassword')
        .custom((value, { req }) => { 
            if (value !== req.body.password) { 
                throw new Error('passwords are not matched')
            }
            return true
        })

], userController.postResetPassword)

//logout user route
router.get('/logout-user', auth ,userController.postLogout)
//delete user route
router.post('/delete-user', auth,userController.deleteUser)


module.exports=router