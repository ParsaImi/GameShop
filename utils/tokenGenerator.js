const jwt = require("jsonwebtoken")

const signToken = (id) => {
    return jwt.sign({id} , process.env.JWT_SECRET , { expiresIn : process.env.JWT_EXPIRE })  
 }

function createAndSendToken(user , status , res){
    const token = signToken(user._id)
    res.cookie("jwt" , token , { 
        expires : new Date(Date.now() + procces.env.JWT_COOKIE_EXPIRES)
     } )
    res.status(status).json({
        token,
        data : {
            user
        }
    })
}

module.exports = createAndSendToken;