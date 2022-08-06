const mongoose = require("mongoose")
const crypto = require("crypto")
const validator = require("validator")
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
    name : {type : String , required : [true , "a user need name"]},
    password : {type : String , required : [true , "a user need password"] , minLength : 8 , select : false},
    passwordconfirm : {type : String ,
    required : [true , "a user need passwordConfirm"] ,
    validate : { validator : function(el) {
        return el === this.password
    } , message : " The Password Shoud be the Same" }  },
    email : {type : String , required : [true , "a user need email"] , unique : true , lowercase : true , validate : [validator.isEmail]},
    photo : {type : String },
    passwordChangedAt : Date,
    role : {type : String , enum : ["user","admin"] , default : "user"},
    resetPasswordToken : String,
    resetPasswordTokenExpire : Date,
    active : {
        type : Boolean,
        default : true,
        select : false
    }

})


userSchema.pre(/^find/ , function (next) {
    this.find({active  : {$ne : false}})
    next()
})

userSchema.pre('save' , async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password , 12);
    this.passwordconfirm = undefined;
    next()
})

userSchema.pre("save" , function(next){
    if(!this.isModified("password") || this.isNew) return next()
    this.passwordChangedAt = Date.now() - 1000;
    next()
})

userSchema.methods.correctPassword = async function(candidatePass , userPass){
    return await bcrypt.compare(candidatePass , userPass)
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changetoTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000 , 10)
        console.log(changetoTimeStamp , JWTTimestamp);
        return (JWTTimestamp < changetoTimeStamp)
    }
    //false mean password nor cahnged
    return false;
}

userSchema.methods.createTokenResetPass = function(){
   const resetToken =  crypto.randomBytes(32).toString("hex");
   this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest("hex");
   this.resetPasswordTokenExpire = Date.now() + 10 * 60 * 1000;
   return resetToken;
}

// userSchema.methods.testmethod = function(){
//     return "salam"
// }


const User =  mongoose.model("User" , userSchema)

module.exports = User