const User = require('./../models/userModel');
const catchAsync = require("./../utils/catchAsync")
const AppError = require("./../utils/appErrors")
const factory = require("./handleFactory")


const filterObj = (obj , ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if(allowedFields.includes(el)){
            newObj[el] = obj[el]
        }
    })
    return newObj
}

exports.getMe = (req , res , next) => {
    req.params.id = req.user.id
    next()
}

exports.getALLUsers = factory.getAll(User)


exports.getUser = factory.getOne(User)


exports.deleteAllUsers = catchAsync(async(req , res, next) => {
    await User.deleteMany({});
    res.status(202).json({
        status : "sucessful",
        message : "All of the users have been deleted"
    })
})


exports.updateMe = catchAsync(async (req , res , next) => {
    if(req.body.password || req.body.passwordconfirm){
        return next(new AppError("this route is not oragnize for passwords " , 400))
    }
    const filteredBody = filterObj(req.body , "name" , "email")
    const updatedUser = await User.findByIdAndUpdate(req.user.id , filteredBody , {
        new : true,
        runValidators : true

    })
    res.json({
        message : "updated !",
        user : updatedUser
    })
})


exports.updateUser = factory.updateOne(User)

exports.deleteMe = catchAsync(async (req ,res ,next) => {
    await User.findByIdAndUpdate(req.user.id , {active : false})
    res.status(201).json({
        data : null
    })
})


exports.deleteOne = factory.deleteOne(User)