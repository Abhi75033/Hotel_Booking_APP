import {User} from '../models/User.model.js'
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import cookieParser from 'cookie-parser';


const jwtVerify = asyncHandler(async (req,res,next)=>{
    try {
        let token = req.cookies.accessToken
        console.log(req.cookies.accessToken);
        if (!token) {
            throw new ApiError(401,'Unauthorized Access')
        }
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRECT)

        const user = await User.findById(decoded._id).select('-password -refreshtoken')
        if (!user) {
            throw new ApiError(404,'Invalid Access Token')
        }
        req.user = user
        next()
    } catch (error) {
        throw error
    }
})

export {jwtVerify}