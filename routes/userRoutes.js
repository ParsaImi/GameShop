const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const express = require('express')
const router = express.Router()



router.post("/signup", authController.signUp)
router.post("/login" , authController.login)
router.get('/logout' , authController.logout)


router.post("/forgetPassword", authController.forgetPassword)

  
router.patch("/resetPassword/:token" , authController.resetPassword)



router.use(authController.protect)

router.patch("/changePassword" , authController.changePassword)

router.patch("/updateMe"  , userController.updateMe)
router.delete("/deleteMe" , userController.deleteMe)


router.get("/me" , userController.getMe , userController.getUser)

router.use(authController.restrictTo("admin"))

router.route('/')
.get(userController.getALLUsers)
.delete( authController.restrictTo("admin") , userController.deleteAllUsers)

router.route("/:id")
.get(userController.getUser)
.delete(userController.deleteOne)
.patch(userController.updateUser)



module.exports = router
