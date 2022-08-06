const express = require('express');
const fs = require('fs');
const app = express();
const morgan = require("morgan")
app.use(express.json())
const tourRouter = require("./routes/tourRoutes")
const userRouter = require("./routes/userRoutes");
const AppError = require('./utils/appErrors');
const globalErrorHandler = require("./controllers/errorController")

app.use((req,res,next) => {
 next()
})

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







