const express = require('express');
const fs = require('fs');
const app = express();
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const mongoSanitize = require("express-mongo-sanitize")
const hpp = require("hpp")
const xss = require("xss-clean")
const tourRouter = require("./routes/tourRoutes")
const userRouter = require("./routes/userRoutes");
const AppError = require('./utils/appErrors');
const globalErrorHandler = require("./controllers/errorController")

//Sec 
app.use(helmet())

const limiter = rateLimit({
    max : 100,
    windowMs : 60 * 60 * 1000,
    message : "many request from this IP , please try again for a hour" 
})

app.use("/api" , limiter)

app.use(mongoSanitize())

app.use(xss())

app.use(hpp({ 
    whitelist : ["steamRating"]
 }))

app.use(express.json({ limit : "10kb" }))
app.use('/api/v1/tours' , tourRouter)
app.use('/api/v1/users' , userRouter)
app.all( '*', (req ,res ,next) => {

    next( new AppError(`not deine ${req.originalUrl}` , 404));
})
///// Global Error Handler
app.use(globalErrorHandler)
// app.use((req ,res ,next) => {
//     req.reqTime = new Date()
//     next()
// })
module.exports = app


// app.get('/api/v1/tours' , getAllTours )

// app.get('/api/v1/tours/:id' , getOneTour)

// app.get('/api/v1/users' , getALLUsers )

// app.post(`/api/v1/tours` , createNewTour )







