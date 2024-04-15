import { Router } from "express";
import { login, ragister } from "../Controller/User.controller.js";
import {uplod} from "../middleware/Multer.midddleware.js"

const router = Router()

router.route('/ragister').post(uplod.fields(
    [
        {name:'avatar',maxCount:1},
        {name:'CoverImage',maxCount:1}
    ]
),ragister)

router.route('/login').post(login)





// router.route('/ragister').get(check)

export default router