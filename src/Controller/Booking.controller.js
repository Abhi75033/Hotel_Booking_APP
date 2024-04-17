import { Booking } from "../models/Booking.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Hotel from "../models/Hotel.model.js";
import mongoose from "mongoose";


const Hotel_Booking = asyncHandler(async(req,res)=>{
    const {name,Phone_No,booking_from,booking_up_to,no_of_rooms} = req.body
    const {id} = req.params


if(!(name && Phone_No && booking_from && booking_up_to,no_of_rooms)){
    throw new ApiError(400,'All feilds are required')
}

const existedBooking = await Booking.findOne({Phone_No})

if (existedBooking) {
    throw new ApiError(400,'Booking already existed')
}

const hotel = await Hotel.findById(id)


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

if(currentTime>12){
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
    no_of_rooms,
})

if(!Booked){
    throw new ApiError(400,'Booking Failed')
}

res.status(201).json(
    new ApiResponse(200,{Booked},'Booking Confirmed')
)

})

const UpdateBookingDetails= asyncHandler(async(req,res)=>{
    const {name,Phone_No,booking_from,booking_up_to,no_of_rooms}=req.body
     const {id}=req.params

     let booking = await Booking.findById(id)

     if(!booking){
         throw new ApiError(404,'Booking not found')
     }

        const hotel = await Hotel.findById(booking.Hotel)

        if (!hotel) {
            throw new ApiError(404,'Hotel not found')
        }

        if(no_of_rooms<booking.no_of_rooms){
            const UpdatedRooms = booking.no_of_rooms - no_of_rooms
            hotel.No_Of_Rooms = hotel.No_Of_Rooms + UpdatedRooms
            await hotel.save()
        }else{
            const UpdatedRooms = no_of_rooms - booking.no_of_rooms
            hotel.No_Of_Rooms = hotel.No_Of_Rooms - UpdatedRooms
            await hotel.save()
        }

     if (name || Phone_No|| booking_from|| booking_up_to|| no_of_rooms) {
        
        const booking = await Booking.findByIdAndUpdate(id,{
        name,
        Phone_No,
        booking_from,
        booking_up_to,
        no_of_rooms
    },{new:true})
        
     }

     res.status(200).json(new ApiResponse(200,{booking},'Booking Updated'))
    })

const cnacelBooking = asyncHandler(async(req,res)=>{
    const {id}=req.params

    const Bookings = await Booking.findByIdAndUpdate(id,
        {Status:'Canceled'},
        {new:true})

        if (!Bookings) {
            throw new ApiError(404,'There no booking to canceled')
        }

        const hotel = await Hotel.findById(Bookings.Hotel)

        if (!hotel) {
            throw new ApiError(500,'Hotel not found to cancel Booking')
        }

        if (Bookings.Status=='Canceled') {
            const rooms = Bookings.no_of_rooms
            hotel.No_Of_Rooms = hotel.No_Of_Rooms + rooms
            await hotel.save()
        }

        Bookings.no_of_rooms = 0
        await Bookings.save()

        if (!Bookings) {
            throw new ApiError(500,'Booking cancelation failed')
        }

        res.status(200).json(
            new ApiResponse(200,{Bookings},'Booking Cancled SuccessFully')
        )
})

const findBookingsByPhoneNo = asyncHandler(async(req,res)=>{
    const {Phone_No} = req.body
    console.log(Phone_No)

    const Bookings = await Booking.findOne({Phone_No})

    if (!Bookings) {
        throw new ApiError(404,'Bookings not found')
    }

    res.status(200).json(
        new ApiResponse(200,{Bookings},'Bookings fetched SuccessFully')
    )
})

export {Hotel_Booking,UpdateBookingDetails,cnacelBooking,findBookingsByPhoneNo}