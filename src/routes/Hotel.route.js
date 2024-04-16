import { Router } from "express";
import { createHotel } from "../Controller/Hotel.controller.js";
import { uplod } from "../middleware/Multer.midddleware.js";
import { jwtVerify } from "../middleware/Auth.middleware.js";
import { Admin } from "../middleware/admin.middleware.js";


const router = Router()

router.route('/create_hotel').post(jwtVerify,Admin,uplod.array('image',5),createHotel)

export default router