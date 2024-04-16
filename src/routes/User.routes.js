import { Router } from "express";
import { login, logout, ragister } from "../Controller/User.controller.js";
import {uplod} from "../middleware/Multer.midddleware.js"
import { jwtVerify } from "../middleware/Auth.middleware.js";

const router = Router()

router.route('/ragister').post(uplod.fields(
    [
        {name:'avatar',maxCount:1},
        {name:'CoverImage',maxCount:1}
    ]
),ragister)

router.route('/login').post(login)

router.route('/logout').post(jwtVerify,logout)





// router.route('/ragister').get(check)

export default router