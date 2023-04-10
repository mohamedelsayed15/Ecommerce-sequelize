const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const auth = require('../middleware/auth')

router.get('/create-user', userController.getSignup)

router.post('/create-user', userController.postSignup)

router.get('/login-user', userController.getLogin)

router.post('/login-user', userController.postLogin)

router.get('/forgot-password', userController.getForgotPassword)

router.post('/forgot-password', userController.postForgotPassword)

router.post('/delete-user', auth,userController.deleteUser)

router.get('/logout-user', auth ,userController.postLogout)

module.exports=router