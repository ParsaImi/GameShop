const fs = require('fs')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const express = require('express')
const app = express()
const router = express.Router()



router.post("/signup", authController.signUp)
router.post("/login" , authController.login)


router.post("/forgetPassword", authController.forgetPassword)


router.patch("/resetPassword/:token" , authController.resetPassword)

router.patch("/changePassword" , authController.protect , authController.changePassword)

router.patch("/updateMe" , authController.protect , userController.updateMe)
router.delete("/deleteMe" , authController.protect , userController.deleteMe)

router.route('/')
.get(userController.getALLUsers)
.delete( authController.protect , authController.restrictTo , userController.deleteAllUsers)


module.exports = router
