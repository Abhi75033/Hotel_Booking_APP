import {v2 as cloudinary} from 'cloudinary'
import { ApiError } from './ApiError.js';
import { ApiResponse } from './ApiResponse.js';
// import { uplod } from '../middleware/Multer.midddleware.js';
import fs from 'fs'

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRECT
});

const UploadOnCloudinary = async(localpath)=>{
    try {
        if (!localpath) return null
        const response = await cloudinary.uploader.upload(localpath,{
            resource_type:'auto'
        })
        fs.unlinkSync(localpath)
        return response
    } catch (error) {
        fs.unlinkSync(localpath)
        return null
    }
}

const DeleteOnCloudinary = async(Public_id)=>{
    try {
        if (!Public_id) {
            throw new ApiError(400,"Public Id is valid")
        }
        const response = await cloudinary.uploader.destroy(Public_id)
        
        return res.status(200).json(
            new ApiResponse(200,response,"File has been deleted Successfully")
        )
    } catch (error) {
        return new ApiError(500,"Internal Server Error")
    }

}

export {
UploadOnCloudinary,
DeleteOnCloudinary
}

