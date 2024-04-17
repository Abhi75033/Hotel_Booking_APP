import { Router } from "express";
import { createHotel } from "../Controller/Hotel.controller.js";
import { uplod } from "../middleware/Multer.midddleware.js";
import { jwtVerify } from "../middleware/Auth.middleware.js";
import { Admin } from "../middleware/admin.middleware.js";
import { Hotel_Booking, UpdateBookingDetails,cnacelBooking, findBookingsByPhoneNo } from "../Controller/Booking.controller.js";


const router = Router()

router.route('/create_hotel').post(jwtVerify,Admin,uplod.array('image',5),createHotel)

router.route('/booking/:id')
.post(jwtVerify,Hotel_Booking)
.patch(jwtVerify,UpdateBookingDetails)

router.route('/cancled/:id').patch(jwtVerify,cnacelBooking)
router.route('/findbookings').get(jwtVerify,findBookingsByPhoneNo)

export default router