const { promisify } = require("util")
const crypto = require("crypto")
const User = require("./../models/userModel")
const createAndSendToken = require("./../utils/tokenGenerator")
const catchAsync = require("./../utils/catchAsync")
const jwt = require("jsonwebtoken")
const AppError = require("./../utils/appErrors")
const sendEmail = require("../utils/email")





exports.signUp = catchAsync(async (req , res , next) => {
    const newUser = await User.create({
        name : req.body.name , 
        email : req.body.email,
        password : req.body.password,
        passwordconfirm : req.body.passwordconfirm,
        passwordChangedAt : req.body.passwordChangedAt,
        role : req.body.role,
        resetPasswordToken: req.body.resetPasswordToken,
        resetPasswordTokenExpire : req.body.resetPasswordTokenExpire
    })

    createAndSendToken(newUser , 201 , res);
})



exports.login = catchAsync(async (req , res , next) => {
    const email = req.body.email;
    const password = req.body.password
    if(!email || !password){
        return next(new AppError("email or password does not find " , 400 ))
    }

    const user = await User.findOne({email : email}).select('+password')
    

    if(!user || !(await user.correctPassword(password , user.password))){
        return next(new AppError("Incrorrect email or password" , 401))
    }

   createAndSendToken(user , 200, res)
})


exports.logout = (req , res) => {
    res.cookie('jwt' , 'loggedout' , {
        expires : new Date(Date.now() + 10000),
        httpOnly : true
    })
    res.status(200).json({
        status : 'success'
    })
}



exports.protect = catchAsync(async(req ,res ,next) => {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

        token = req.headers.authorization.split(" ")[1]
        
    }else if(req.cookies.jwt){
        token = req.cookies.jwt
    }

    if(!token){
        return next(new AppError("you are not logged in , please loging in" , 401))
    }


    //verify token
    const decoded = await promisify(jwt.verify)(token , process.env.JWT_SECRET)


    const freshUser = await User.findById(decoded.id)

    if(!freshUser){
        return  next( new AppError("this user is no longer exist" , 401))
    }

    // check the user for changing password


    if(freshUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError("The password was chenged , please login with new password" , 401))
    }

    req.user = freshUser
    res.locals.user = freshUser
    next()

})







exports.isLoggedIn = async(req ,res ,next) => {

    if(req.cookies.jwt){
        try{
    
        //verify token
        const decoded = await promisify(jwt.verify)(req.cookies.jwt , process.env.JWT_SECRET)
    
    
        const freshUser = await User.findById(decoded.id)
    
        if(!freshUser){
            return next()
        }
    
        // check the user for changing password
    
    
        if(freshUser.changedPasswordAfter(decoded.iat)){
            return next()
        }
        req.user = freshUser
        res.locals.user = freshUser
        return next()
    }catch(err){
        return next()
    }
}
    next()


}















exports.restrictTo = (...roles) => {
    return (req , res , next) => {
        if(!roles.includes(req.user.role)){
            return next(new AppError("You dont have perm to this action" , 403))
        }
        next()
    }
}

exports.forgetPassword = catchAsync(async (req , res , next) => {
    const user = await User.findOne({ email : req.body.email})
    if(!user){
        return next(new AppError("this email is no exist in this shop" , 404))
    }

    // create token for password reset

    const resetToken = user.createTokenResetPass();
    // console.log(test);
    // console.log(resetToken);
    await user.save({validateBeforeSave : false})

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
    console.log(resetURL);
    const message = `forgot Your password? Submit a PATCH request with your new password and passwordConfirm to : ${resetURL} if you didnt ignore this email `
    await sendEmail({
        email : user.email,
        subject : "Your password reset token is valid for 10 minute",
        message : message
    })

    res.status(200).json({
        status : "success",
        message : "token sent to email"
    })
})

exports.resetPassword =catchAsync(  async (req , res , next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest("hex");
   const user = await User.findOne({resetPasswordToken : hashedToken , resetPasswordTokenExpire : {$gt : Date.now()}})
   
   if(!user){
       return next( new AppError("the token is not valid or is expired" , 400))
   }

   user.password = req.body.password;
   user.passwordconfirm = req.body.passwordconfirm;
   user.resetPasswordToken = undefined;
   user.resetPasswordTokenExpire = undefined;
   await user.save()

  createAndSendToken(user , 200 , res)
   

} 
)

exports.changePassword = catchAsync(async(req , res , next) => {
    const user = await User.findById(req.user.id).select("+password")
    if(! (await user.correctPassword(req.body.password , user.password)) ){
        return next(new AppError("the password is incorrect" , 401))
    }
    user.password = req.body.newpassword;
    user.passwordconfirm = req.body.newpasswordconfirm

    await user.save()
    createAndSendToken(user , 200 , res)


    
}
)