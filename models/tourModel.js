const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')
const User = require("./userModel")
const tourSchema = new mongoose.Schema({
    name : { type : String , unique : true ,  required : [true , 'A tour must have a name'] , maxlength : [40 , 'The Max Size Of Name is 15 , plz Change it'] , minlength : [3 , 'The Min name is 3'] ,},
    slug : String,
    price : { type : Number , required : [true , 'A tour must have a number']},
    steamRating : { type : Number , required : [true , 'a rating is require'] , min : [1 , 'min is 1'] , max : [5 , 'max is 5']  },
    ratingQuantity : {type : Number , defualt : 0},
    description : { type : String , required : [true , 'a description is require']},
    imageCover : { type : String , required : [true , 'pick a picture']}, 
    images : [String],
    createdAt : {
        type : Date,
        default : Date.now()
    },
    releaseDate : Date,
    isExist : { type : Boolean , defualt : true },
    startDates : [Date],
    secretGame : {type : Boolean , default : false},
    discount : {type : Number },
    meetingLocation: {
        type : {
            type : String,
            defualt : 'Point',
            enum : ['Point']
        },
        coordinates : [Number],
        address : String,
        description : String
    },

    shopsLocations: [{
        type : {
            type : String,
            defualt : 'Point',
            enum : ['Point']
        },
        coordinates : [Number],
        address : String,
        description : String,
        day : Number
    }],
    guides : [
        {
            type : mongoose.Schema.ObjectId, 
            ref : "User"
        }
    ]
} , {toJSON : { virtuals : true }  ,  toObject : { virtuals : true }})







////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


tourSchema.index({price : 1 })
tourSchema.index({slug : 1})
tourSchema.index({meetingLocation : "2dsphere"})


tourSchema.virtual('ratingNumber').get(function(){
    return this.steamRating * 10
})

tourSchema.virtual('reviews' , {
    ref : "Review",
    foreignField : "tour",
    localField : "_id"
})

tourSchema.pre('save' , function(next){
    this.slug = slugify(this.name , {lower : true})
    next()
})

tourSchema.pre(/^find/ , function(next) {
    this.populate({
        path : 'guides'
    })

    next()
})



// tourSchema.pre("save" , async function(next) {
//     const guidesPromises  = this.guides.map( async id => 
//         await User.findById(id)
//     )

//     this.guides = await Promise.all(guidesPromises)

//     next()
    
// })

// tourSchema.post('save' , function(doc , next) {
//     console.log(doc);
// })

tourSchema.pre(/^find/ , function(next){
    this.find({secretGame : { $ne : true } })
    this.firstPing = Date.now()
    next()
})





const Tour = mongoose.model('Tour' , tourSchema)

module.exports = Tour