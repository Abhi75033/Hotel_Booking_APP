import { Router } from "express";
import { getUserById, login, logout, ragister, updateAvatar } from "../Controller/User.controller.js";
import {uplod} from "../middleware/Multer.midddleware.js"
import { jwtVerify } from "../middleware/auth.middleware.js";

const router = Router()

router.route('/ragister').post(uplod.fields(
    [
        {name:'avatar',maxCount:1},
        {name:'CoverImage',maxCount:1}
    ]
),ragister)

router.route('/login').post(login)

router.route('/logout').post(jwtVerify,logout)

router.route('/image/uplod').post(jwtVerify,uplod.fields([
    {name:'avatar',maxCount:1}, 
]),updateAvatar)

router.route('/userbyid').get(jwtVerify,getUserById)





// router.route('/ragister').get(check)

export default router