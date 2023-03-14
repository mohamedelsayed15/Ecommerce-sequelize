const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')


router.post('/create-user', userController.signup)

router.post('/login-user', userController.login)

module.exports=router