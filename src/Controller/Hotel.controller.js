import { Hotel } from "../models/Hotel.model";
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"

const createHotel = asyncHandler(async(req,res)=>{
    const{Hotel_Name,description,Address,city,Country,Pincode,checkIn,checkOut,No_Of_Rooms,Price}=req.body
    
    if(!Hotel_Name || !description || !Address || !city || !Country || !Pincode || !checkIn || !checkOut || !No_Of_Rooms || !Price){
        res.status(400)
        throw new Error("All fields are required")
    }

    const ExistedHotel = await Hotel.findOne({Hotel_Name})

    if(ExistedHotel){
        throw new ApiError(400, "Hotel already exists")
    }

    let avatarLocalpath = req.file.avatar[0].path

    if(!avatarLocalpath){
        throw new ApiError(400, "Please provide a avatar image")
    }

    

})


