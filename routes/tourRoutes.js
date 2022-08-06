const express = require('express');

const fs = require('fs')

const app = express()

app.use(express.json())

const router = express.Router()

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
.get(tourController.getMonthlyPlan)

router.route("/")
.get( authController.protect ,tourController.getAllTours)
.post( tourController.checkBody , tourController.createNewTour)

router.route('/:id')
.get(tourController.getOneTour)
.patch(tourController.updateTour)
// .delete( authController.protect , authController.restrictTo ,tourController.deleteTour)


module.exports = router;


