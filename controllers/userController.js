const User = require('./../models/userModel');
const catchAsync = require("./../utils/catchAsync")
const AppError = require("./../utils/appErrors")


const filterObj = (obj , ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if(allowedFields.includes(el)){
            newObj[el] = obj[el]
        }
    })
    return newObj
}


exports.getALLUsers = catchAsync(async (req , res , next) => {
    const users = await User.find();
    res.status(200).json({
        userLength : users.length,
        data : {
            users
        }
    })
})


exports.deleteAllUsers = catchAsync(async(req , res, next) => {
    await User.deleteMany({});
    res.status(202).json({
        status : "sucessful",
        message : "All of the users have been deleted"
    })
})


exports.updateMe = catchAsync(async (req , res , next) => {
    if(req.body.password || req.body.passwordconfirm){
        return next(new AppError("this route " , 400))
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


exports.deleteMe = catchAsync(async (req ,res ,next) => {
    await User.findByIdAndUpdate(req.user.id , {active : false})
    res.status(201).json({
        data : null
    })
})