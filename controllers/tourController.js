const Tour = require('./../models/tourModel');
const catchAsync = require("./../utils/catchAsync")
const AppErrors = require('./../utils/appErrors')
const globalErrorHandler = require("./../controllers/errorController")
const factory = require("./handleFactory")
// const express = require('express')

// exports.checkId = (req , res , next , val) => {
//     if(Number(val) > tours.length){
//         res.end("Not Found")
//     }else{
//         next()
//     }
// }


exports.aliasTopTours = (req, res, next) => {
  req.query.sort = '-steamRating';
  next();
};

exports.getAllTours = factory.getAll(Tour)

exports.getOneTour = factory.getOne(Tour , "reviews")

exports.createNewTour = factory.createOne(Tour)

exports.updateTour = factory.updateOne(Tour)

exports.deleteTour = factory.deleteOne(Tour)

exports.getTourStats = catchAsync(async(req, res , next) => {
  const stats = await Tour.aggregate([
    {
      $match: { isExist : true}
    },
    {
      $group : {
        _id : '$isExist',
        num : { $sum : 1 },
        avgRating : { $avg : '$steamRating' },
        minPrice : { $min : '$price' }
        
      }
    }
  ])
  res.json({
    data : {
      stats
    }
  })
});

exports.getMonthlyPlan = catchAsync(async (req , res , next) => {
  const givenYear = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind : '$startDates'
    },
    {
      $match : { startDates : { $gte : new Date(`${givenYear}-01-01`) , $lte : new Date(`${givenYear}-12-31`) } }
    },
    {
      $group : {
        _id : { $month : '$startDates' },
        numOfGames : { $sum : 1 },
        names : { $push : '$name' },
      }
    }
    ,
    {
      $addFields : { month : '$_id' }
    }
    
  ])  
  
  res.json({
    data : {
      plan
    }
  })
});


exports.getToursWithin = catchAsync(async (req, res, next) => {
  const {distance, latlng , unit} = req.params;
  const [lat , lng] = latlng.split(",");

  const radius =  unit === 'mi' ? distance / 3963.2 : distance / 6378.1

  const tours = await Tour.find({meetingLocation : {$geoWithin : {$centerSphere : [[lng , lat] , radius ]}}})

  res.json({
    number : tours.length,
    ok : "ok",
    tours
  })
})


exports.getTourDistance = catchAsync(async (req , res , next) => {

  const {latlng , unit} = req.params;
  const [lat , lng] = latlng.split(",");
  const multiplier = unit === "mi" ? 0.000621371 : 0.001
  const distance = await Tour.aggregate([
    {
      $geoNear : {
        near : {
          type : "Point",
          coordinates : [lng * 1 , lat * 1]
        },
        distanceField : 'distance',
        distanceMultiplier : multiplier
      }
    },
    {
      $project : {
        name : 1,
        distance : 1
      }
    }

  ])

  res.json({
    ok : "ok",
    result : distance
  })
})

