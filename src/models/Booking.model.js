import mongoose, { Schema } from "mongoose";

const BookingSchema = new mongoose.Schema({
name:{
    type:String,
    required:true
},
Phone_No:{
    type:Number,
    required:true
},
booking_from:{
    type:String,
    requird:true
},
booking_up_to:{
    type:String,
    required:true
},
Hotel:{
    type: Schema.Types.ObjectId,
    ref:'Hotel'
},
owner:{
    type:Schema.Types.ObjectId,
    ref:'User'
},
Hotel_Name:{
    type:String,
    required:true
},
Booked_By:{
    type:Schema.Types.ObjectId,
    ref:"User"
},
isBooked:{
    type:Boolean,
    default:true
},
Booking_date:{
    type:Date,
    default:Date.now()
},
Bookin_Time:{
type:String,
default:Date.now().toLocaleString()
},
Status:{
type:String,
enum:["Booked","CheckedIn","CheckOut","Canceled"],
default:"Booked"
},
no_of_rooms:{
    type:Number,
    required:true
}
},{timestamps:true})


export const Booking = mongoose.model('Booking',BookingSchema)