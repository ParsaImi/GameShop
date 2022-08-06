const AppError = require("../utils/appErrors")
const handleCastErrorDB = err => {
    const message = `invalid ${err.path} for ${err.value} .`;
    return new AppError(message , 400);
}

const handleDublicated = (err) => {
    const value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    console.log(value);
    console.log(value);
    const message = `dublicated ${value}`;
    return new AppError(message , 400)
    // const message : `Duplicate This value : ${value} , plz fix it`
}

const handleValidation = (err) => {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `invalid input Data : ${errors.join(".")}`;
    return new AppError(message , 400)
}

const handleJWTError = (err) => {
    return new AppError("the token is invalid please login again!" , 401)
}

const handleTokenExpiredError = (err) => {
    return new AppError("this token is expired , please login again" , 401)
}
module.exports = (err , req ,res , next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error';


    //functions

const sendingErrorProd = (err , res) => {
    if(err.isOperational){
    res.status(err.statusCode).json({
        status : err.status,
        message : err.message,
    })
}else{
    res.status(500).json({
        status : "error",
        message : "someThing in server went wrong"
    })
}
}

const sendingErrorDev = (err , res) => {
    res.status(err.statusCode).json({
        statusCode : err.statusCode,
        error : err,
        status : err.status,
        message : err.message,
    
    })

}

//end of functions


    if(process.env.NODE_ENV === "development"){
        sendingErrorDev(err , res)

    }else if(process.env.NODE_ENV === "production"){
        console.log(err.name);
        let error = {...err}
        if(err.name === "CastError"){
            error =  handleCastErrorDB(err)
        }
        if(err.code === 11000){
            error = handleDublicated(err)
        }
        if(err.name === "ValidationError"){
            console.log(err.name);
            error = handleValidation(err)
        }
        if(err.name === "JsonWebTokenError"){
            error = handleJWTError(err)
        }
        if(err.name === "TokenExpiredError"){
            error === handleTokenExpiredError(err)
        }
        sendingErrorProd(error , res)
    }

    next()
}