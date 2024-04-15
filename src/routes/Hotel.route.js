import { Router } from "express";
import { createHotel } from "../Controller/Hotel.controller.js";
import { uplod } from "../middleware/Multer.midddleware.js";


const router = Router()

router.route('/create_hotel').post(uplod.array('image',5),createHotel)

export default router