import Hotel from "../models/Hotel.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UploadOnCloudinary } from "../utils/Cloudniary.utils.js";


const createHotel = asyncHandler(async(req,res)=>{
const {Hotel_Name,description,Address,city,Country,Pincode,checkIn,checkOut,No_Of_Rooms,Price} = req.body

console.log(Hotel_Name,description,Address,city,Country,Pincode,checkIn,checkOut,No_Of_Rooms,Price);

if(!(Hotel_Name && description && Address && city && Country && Pincode && checkIn && checkOut && No_Of_Rooms && Price)){
    throw new ApiError(400,'Please provide all the required fields')
}

const existedHotel = await Hotel.findOne({Hotel_Name})

if (existedHotel) {
    throw new ApiError(400,'Hotel already existed')   
}

const imageLocalPath = req.files.map((file)=>file.path)

if (!imageLocalPath) {
    throw new ApiError(400,'Please provide a image')
    
}

const images = imageLocalPath.map(async(image)=>{
 return  await UploadOnCloudinary(image)
 
})

const imagess = await Promise.all(images)
console.log(imagess);

if (!images) {
    throw new ApiError(500,'Image upload failed')
}

const hotel = await Hotel.create({
    Hotel_Name,
    description,
    Address,
    city,
    Country,
    Pincode,
    checkIn,
    checkOut,
    No_Of_Rooms,
    Price,
    image:imagess.map((image)=>image.url),
    Owner:req.user._id
})

return res.status(200).json(new ApiResponse(200,'Hotel created successfully',{hotel})
)

})


export {createHotel}