const jwt = require("jsonwebtoken")

const signToken = (id) => {
    return jwt.sign({id} , process.env.JWT_SECRET , { expiresIn : process.env.JWT_EXPIRE })  
 }

function createAndSendToken(user , status , res){
    const token = signToken(user._id)
    const cookieOptions = {
        expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000 ),
        httpOnly : true
    }

    if(process.env.NODE_ENV === "production") cookieOptions.secure = true;
    user.password = undefined

    res.cookie("jwt" , token , cookieOptions)
    res.status(status).json({
        token,
        data : {
            user
        }
    })
}

module.exports = createAndSendToken;