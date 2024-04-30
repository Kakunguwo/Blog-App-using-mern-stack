const jwt = require("jsonwebtoken");
const HttpError = require("../models/errorModel");

const authMiddleware = async (req, res, next) =>{
    const authorizationHeader = req.header("Authorization");

    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")){
        const token = authorizationHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, info)=>{
            if(err){
                return next(new HttpError("Unauthorised. Invalid token.", 422));
            }

            req.user = info;
            next();
        })
    } else{
        return next(new HttpError("Unauthorised, no token", 422));
    }
}




module.exports = authMiddleware;