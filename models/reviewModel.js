const mongoose = require("mongoose")
const tourController = require("./../controllers/tourController")
const Tour = require("./tourModel")

const reviewSchema = new mongoose.Schema({
    review : {type : String , required : [true , "you should leave a comment"]},
    rating : {type : Number , required : [true , "plz leave a rating"] , min : 1 , max : 5 , set : value => Math.round(value * 10) / 10},
    createdAt : {
        type : Date ,
        default : Date.now()
    },
    tour : {
        type :  mongoose.Schema.ObjectId,
        ref : "Tour",
        required : [true , 'chose your tour to comment']
    },
    user: {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : [true , "who wrote this?"]
    }
} ,  {toJSON : { virtuals : true }  ,  toObject : { virtuals : true }})


reviewSchema.index({tour : 1 , user : 1} , {unique : true})


reviewSchema.pre(/^find/ , function(next) {
    this.populate({
        path : 'user'
    })

    next()
})

reviewSchema.pre("save" , function(next) {
    this.populate({
        path : 'tour'
    })

    next()
})


reviewSchema.statics.calcAverageRaiting = async function(tourId){
    const stats =  await this.aggregate([
        {
            $match : {tour : tourId}
        },
        {
            $group : {
                _id : "$tour",
                nRating : { $sum : 1 } ,
                avgRating : { $avg : "$rating" }
            }
        }
    ])
    if(stats.length > 0){

        await Tour.findByIdAndUpdate(tourId , {steamRating : stats[0].avgRating , ratingQuantity : stats[0].nRating})
    }else{
        await Tour.findByIdAndUpdate(tourId , {steamRating : 5 , ratingQuantity : 0})
    }
}

reviewSchema.post("save" , function(){
    this.constructor.calcAverageRaiting(this.tour)
})    

reviewSchema.pre(/^findOneAnd/ , async function(next) {
    this.r = await this.findOne();
    next()
}) 

reviewSchema.post(/^findOneAnd/ , async function() {
    await this.r.constructor.calcAverageRaiting(this.r.tour)
})

const Review = mongoose.model("Review" , reviewSchema)


module.exports = Review