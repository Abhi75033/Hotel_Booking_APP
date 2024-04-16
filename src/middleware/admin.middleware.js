import {User} from '../models/User.model.js'
import { ApiError } from '../utils/ApiError.js'
import {asyncHandler} from '../utils/asyncHandler.js'


const Admin = asyncHandler(async(req,res,next)=>{
    try {
        const user = await User.findById(req.user._id)
    
        if (!user) {
            throw new ApiError(404,'User not found')
        }
    
        const isAdmin = user.isAdmin

        if (!isAdmin) {
            throw new ApiError(401,'You are not Authroized')
        }
        next()
    } catch (error) {
        throw error
    }


})

export {Admin}