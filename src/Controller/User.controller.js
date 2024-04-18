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
const {name,email,password} = req.body
// if ([name,email,password].some((fields)=>fields?.trim() === '')) {
//     throw new ApiError(400,'Please provide all the required fields')
// }

if (!name || !email || !password) {
    throw new ApiError(400,'Please provide all the required fields')
    
}

const existedUser = await User.findOne({email})

if (existedUser) {
    throw new ApiError(400,'User already existed')   
}

let avatar;
let CoverImage;

if (req.files && req.files.avatar && req.files.CoverImage) {
    const avatarLoclpath = req.files.avatar[0].path
    
    if (!avatarLoclpath) {
        throw new ApiError(400,'Please provide a avatar image')
    }
    
    const CoverImageLoclpath = req.files.CoverImage[0].path
    
    if (!CoverImageLoclpath) {
        throw new ApiError(400,'Please provide a CoverImage image')
    
    }
    
     avatar = await UploadOnCloudinary(avatarLoclpath)
     CoverImage = await UploadOnCloudinary(CoverImageLoclpath)
    
    if (!avatar || !CoverImage) {
        throw new ApiError(500,'Image upload failed')
    }
    
}
const user = await User.create({
    name,
    email,
    password,
    avatar:avatar?.secure_url || null,
    CoverImage:CoverImage?.secure_url || null
})

return res.status(200).json(new ApiResponse(200,'User created successfully',{user})
)
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