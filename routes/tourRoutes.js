const express = require('express');

const fs = require('fs')

const app = express()

app.use(express.json())

const router = express.Router()

const reviewRoutes = require("./reviewRoutes")
const tourController = require('../controllers/tourController')
const  authController = require('./../controllers/authController')






// router.param('id' , )

// router.param('id' , tourController.checkId)
router
.route("/top-tours")
.get( tourController.aliasTopTours , tourController.getAllTours)

router
.route('/get-stats')
.get(tourController.getTourStats)

router
.route('/monthly-plan/:year')
.get(authController.protect , authController.restrictTo("admin")  , tourController.getMonthlyPlan)

router.route("/tours-within/:distance/center/:latlng/unit/:unit" )
.get(tourController.getToursWithin)


router.route("/distance/:latlng/unit/:unit")
.get(tourController.getTourDistance)

router.route("/")
.get(tourController.getAllTours)
.post( authController.protect , authController.restrictTo("admin") , tourController.createNewTour)

router.route('/:id')
.get(tourController.getOneTour)
.patch(authController.protect , authController.restrictTo("admin") , tourController.updateTour)
.delete(authController.protect , authController.restrictTo("admin")  , tourController.deleteTour)

router.use("/:tourId/reviews" , reviewRoutes)
// .delete( authController.protect , authController.restrictTo ,tourController.deleteTour)


module.exports = router;


