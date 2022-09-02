const path = require("path")
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
const reviewRouter = require("./routes/reviewRoutes")
const viewRouter = require("./routes/viewRouter")
const AppError = require('./utils/appErrors');
const globalErrorHandler = require("./controllers/errorController")
const cookieParser = require('cookie-parser')

app.set("view engine" , "pug")
app.set("views" , path.join(__dirname , "views") )


app.use(express.static(path.join(__dirname , "public")))

//Sec 

const limiter = rateLimit({
    max : 100,
    windowMs : 60 * 60 * 1000,
    message : "many request from this IP , please try again for a hour" 
})

app.use("/api" , limiter)

app.use(mongoSanitize())

// app.use(xss())

app.use(hpp({ 
    whitelist : ["steamRating"]
 }))


// parsers
app.use(express.json({ limit : "10kb" }))
app.use(cookieParser())
app.use(express.urlencoded({extended : true , limit : '10kb'}))

app.use('/' , viewRouter)
app.use('/api/v1/reviews' , reviewRouter)
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







