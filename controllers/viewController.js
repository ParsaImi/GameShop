const User = require('../models/userModel')
const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appErrors')


exports.getOverview = catchAsync(async (req , res , next) => {
    const tours = await Tour.find()
    res.status(200).render('overview' , {
        title : 'All Tour',
        tours
    })
})


exports.getTour =catchAsync(async (req , res , next ) => {
    const tour = await Tour.findOne({slug : req.params.slug}).populate({
        path : 'reviews',
        fields : 'review rating user'
    })
    if(!tour){
        return next(new AppError('the name of the tour is not good' , 404))
    }
    
    res.status(200).render('tour' , {
        title : tour.name,
        tour
    })
})


exports.login = (req , res) => {
    res.status(200).render('login' , {
        title : "login to gameShop"
    })
}



exports.getAccount = (req , res) => {
    res.status(200).render('account' , {
        title : "Persoanl Info"
    })
}

exports.updateUserDate = async  (req , res) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id , {  name : req.body.name,email : req.body.email  }, { new : true, runValidators : true});
    res.status(200).render('account' , {
        user : updatedUser,
        title : 'personal Info'
    })
}

