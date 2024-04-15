import mongoose, { Schema } from 'mongoose'

const HotelSchema = new mongoose.Schema({
    Hotel_Name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true  
    },
    Address:{
        type:String,
        required:true  
    },
    city:{
        type:String,
        required:true
    },
    Country:{
        type:String,
        required:true
    },
    Pincode:{
        type:Number,
        required:true
    },
    checkIn:{
        type:String,
        required:true
    },
    checkOut:{
        type:String,
        required:true
    },
    No_Of_Rooms:{
        type:Number,
        required:true
    },
    Price:{
        type:Number,
        required:true
    },
    image:[
        {
            type:String,
        }
    ],
    Owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true})

 const Hotel = mongoose.model("Hotel",HotelSchema)

 export default Hotel