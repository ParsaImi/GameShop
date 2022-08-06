const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')
const tourSchema = new mongoose.Schema({
    name : { type : String , unique : true ,  required : [true , 'A tour must have a name'] , maxlength : [15 , 'The Max Size Of Name is 15 , plz Change it'] , minlength : [3 , 'The Min name is 3'] , validate : validator.isAlpha},
    slug : String,
    price : { type : Number , required : [true , 'A tour must have a number']},
    steamRating : { type : Number , required : [true , 'a rating is require'] , min : [1 , 'min is 1'] , max : [5 , 'max is 5']  },
    description : { type : String , required : [true , 'a description is require']},
    imageCover : { type : String , required : [true , 'pick a picture']}, 
    image : [String],
    createdAt : {
        type : Date,
        default : Date.now()
    },
    releaseDate : Date,
    isExist : { type : Boolean , required : [true , 'if the Product exist plz fix it'] },
    startDates : [Date],
    secretGame : {type : Boolean , default : false},
    discount : {type : Number }
} , {toJSON : { virtuals : true }  ,  toObject : { virtuals : true }})





////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




tourSchema.virtual('ratingNumber').get(function(){
    return this.steamRating * 10
})

tourSchema.pre('save' , function(next){
    this.slug = slugify(this.name , {lower : true})
    next()
})

// tourSchema.post('save' , function(doc , next) {
//     console.log(doc);
// })

tourSchema.pre(/^find/ , function(next){
    this.find({secretGame : { $ne : true } })
    this.firstPing = Date.now()
    next()
})

tourSchema.post(/^find/ , function( docs , next){
    console.log(Date.now() - this.firstPing );
    next()

})



const Tour = mongoose.model('Tour' , tourSchema)

module.exports = Tour