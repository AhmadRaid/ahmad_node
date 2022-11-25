const express = require('express')
const router = express.Router()
const {singUp , login , forgetPassword , resetPassword} = require('../controllers/authController')

router.route('/auth/singUp').post(singUp)

router.route('/auth/login').post(login)

router.route('/auth/forgetPassword').post(forgetPassword);

router.route('/auth/resetPassword').post(resetPassword);



module.exports = router
