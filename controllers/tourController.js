const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require("./../utils/catchAsync")
const AppErrors = require('./../utils/appErrors')
const globalErrorHandler = require("./../controllers/errorController")
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

exports.getAllTours = catchAsync(async (req, res, next) => {
    // const queryObj = { ...req.query };
    // console.log(req.query);
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => {
    //   delete queryObj[el];
    // });
    // // Advance filtering

    // let queryString = JSON.stringify(queryObj);
    // queryString = queryString.replace(
    //   /\b(gte|gt|lt|lte)\b/g,
    //   (match) => `$${match}`
    // );

    // //Show
    // let query = Tour.find(JSON.parse(queryString));

    //sorting
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   query = query.sort('price');
    // }

    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }

    //Pagination

    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit);
    // if (req.query.page) {
    //   const numOfTours = await Tour.countDocuments();
    //   if (skip >= numOfTours) {
    //     throw new Error('The Page is Not Valid');
    //   }
    // }
    // Execute query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sorting()
      .filterFields()
      .pagination();
    const allTours = await features.query;
    res.json({
      numberOfGames : allTours.length,
      data: {
        tours: allTours,
      },
    });
});

exports.getOneTour = catchAsync(async (req, res , next) => {
    const foundedTour = await Tour.findById(req.params.id);
    res.json({
      data: {
        TheTour: foundedTour,
      },
    });
});

exports.createNewTour = catchAsync (async (req, res ,next) => {
  
    const userIdeal = req.body;
    const newTour = await Tour.create(userIdeal);
    res.json({
      status: 'ok',
      data: {
        tour: newTour,
      },
    });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'bad request',
  //     massage: err,
  //   });
  // }
  // const id =  tours.length
  // const newData = Object.assign( req.body , {id : id})
  // tours.push(newData)
  // fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json` , JSON.stringify( tours ), err => console.log(err))
});

exports.checkBody = (req, res, next) => {
  const userIdeal = req.body;
  const inputKey = Object.keys(userIdeal)[0];
  const inputValue = Object.values(userIdeal)[0];
  // if (inputKey !== 'name' || inputValue.length > 15) {
  //   return res.status(404).json({ status: 'you should fix it' });
  // }
  next();
};

exports.updateTour = catchAsync(async (req, res , next) => {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators : true
    });
    if(!updatedTour){
      next(new AppErrors("this id is not define (not correct)" , 404))
    }
    res.status(200).json({
      status: 'ok',
      data: {
        updateTo: updatedTour,
      },
    });
});

exports.deleteTour = catchAsync(async (req, res , next) => {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    res.json({
      data: {
        test,
      },
    });
});

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


