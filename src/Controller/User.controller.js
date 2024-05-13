import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { UploadOnCloudinary,DeleteOnCloudinary } from "../utils/Cloudniary.utils.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'


const genrateAccessAndRefreshToken = async(UserId)=>{
try {
    const user = await User.findById(UserId)
    const accessToken = await user.genrateAccessToken()
    const refreshtoken = await user.genrateRefreshToken()
    user.refreshtoken = refreshtoken
    user.save({validateBeforeSave:false})
    const data = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRECT)
    console.log(data);
    return {accessToken,refreshtoken}
} catch (error) {
    throw error
}
}

const ragister = asyncHandler(async(req,res)=>{
const {name,email,Username,password}=req.body

if (!name || !email || !Username || !password) {
    return new ApiError(401,"All Feilds are mandatetory")
}
console.log(name,email,Username,password);
const Existedemail= await User.findOne({email})
const ExistedUsername = await User.findOne({Username})

if (Existedemail) {
    throw new ApiError(401,"E-mail is already ragisterd with us")
}

if (ExistedUsername) {
    throw new ApiError(401,"Username is taken by someone")
}

const user = await User.create({
    name,
    email,
    Username,
    password
})

if (!user) {
    throw new ApiError(500,"Internal Error: User is not ragisterd")
}

return res.status(201).json(new ApiResponse(201,"User Ragisterd Successfully",{user}))

})

const login = asyncHandler(async(req,res)=>{
    const{email,password}=req.body

    if (!email && !password) {
        throw new ApiError(400,"Please provide email and password both")
    }

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(404,"user not found")
    }

    const isPassword = await user.isPasswodCorrect(password)
    console.log(isPassword);
    if (!isPassword) {
       throw new ApiError(401,"Invalid password") 
    }

    const {refreshtoken,accessToken}= await genrateAccessAndRefreshToken(user._id)

    const option ={
        httpOnly:true,
        secure:true
    }

    res.status(200)
    .cookie("refreshtoken",refreshtoken,option)
    .cookie("accessToken",accessToken,option)
    .json(
        new ApiResponse(200,{refreshtoken,accessToken},"User logedin")
    )
})

const logout = asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(req.user._id,
    {
        $unset:{
            refreshtoken:1
        }
    },
    {
        new:true
    }
) 

const option ={
    httpOnly:true,
    secure:true
}

res.clearCookie("refreshtoken")
.clearCookie("accessToken")
.status(200).json(new ApiResponse(200,"User loged out"))
})

export {ragister,login,logout}