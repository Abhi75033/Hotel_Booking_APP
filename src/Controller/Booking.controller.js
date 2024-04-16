import { Booking } from "../models/Booking.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Hotel from "../models/Hotel.model.js";
import mongoose from "mongoose";


const Hotel_Booking = asyncHandler(async(req,res)=>{
    const {name,Phone_No,booking_from,booking_up_to,no_of_rooms} = req.body
    const {id} = req.params

    console.log(name,Phone_No,booking_from,booking_up_to);

if(!(name && Phone_No && booking_from && booking_up_to,no_of_rooms)){
    throw new ApiError(400,'All feilds are required')
}

const existedBooking = await Booking.findOne({Phone_No})

if (existedBooking) {
    throw new ApiError(400,'Booking already existed')
}

const hotel = await Hotel.findById(id)

console.log(hotel.Owner);

if (!hotel) {
    throw new ApiError(404,'Hotel not found')
}

// Deleting the no of rooms from the hotel


if(hotel.No_Of_Rooms<no_of_rooms){
    throw new ApiError(400,'No of rooms not available')
}else{
    hotel.No_Of_Rooms = hotel.No_Of_Rooms - no_of_rooms
    await hotel.save()
}


const time = new Date()
let currentTime = `${time.getHours()}:${time.getMinutes()}`

if(currentTime<=12){
    currentTime = `${currentTime} AM`
}else{
    currentTime = `${currentTime} PM`
}

const Booked = Booking.create({
    name,
    Phone_No,
    booking_from,
    booking_up_to,
    Booked_By:req.user._id,
    Hotel:hotel._id,
    Hotel_Name:hotel.Hotel_Name,
    owner:hotel.Owner,
    Bookin_Time:currentTime,
    no_of_rooms
})

if(!Booked){
    throw new ApiError(400,'Booking Failed')
}

res.status(201).json(
    new ApiResponse(200,Booked,'Booking Confirmed')
)

})






export {Hotel_Booking}