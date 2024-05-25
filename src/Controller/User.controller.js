import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import { UploadOnCloudinary,DeleteOnCloudinary } from "../utils/Cloudniary.utils.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'




const genrateAccessAndRefreshToken = async(UserId)=>{
try {
    const user = await User.findById(UserId)
    const accessToken = await user.genrateAccessToken()
    const refreshtoken = await user.genrateRefreshToken()
    user.refreshtoken = refreshtoken
    user.save({validateBeforeSave:false})
    const data = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRECT)
    console.log(data);
    return {accessToken,refreshtoken}
} catch (error) {
    throw error
}
}

const ragister = asyncHandler(async(req,res)=>{
const {name,email,Username,password}=req.body

if (!name || !email || !Username || !password) {
    return new ApiError(401,"All Feilds are mandatetory")
}
console.log(name,email,Username,password);
const Existedemail= await User.findOne({email})
const ExistedUsername = await User.findOne({Username})

if (Existedemail) {
    return res.status(401).send({message:"Email is already ragisterd with us"})
}

if (ExistedUsername) {
   return res.status(401).send({message:"Username is taken by someone"})
}

let avatarLoacalpath;
if(req.files && Array.isArray(req.files.avatarImage) && req.files.avatarImage.length > 0){
    avatarLoacalpath = req.files.avatarImage[0].path
}

const avatar = await UploadOnCloudinary(avatarLoacalpath)

const user = await User.create({
    name,
    email,
    Username,
    password,
    avatar: avatar?.url || " "
})

if (!user) {
    throw new ApiError(500,"Internal Error: User is not ragisterd")
}

return res.status(201).json(new ApiResponse(201,"User Ragisterd Successfully",{user}))

})

const login = asyncHandler(async(req,res)=>{
    const{Username,password}=req.body

    if (!Username || !password) {
         throw new ApiError(400,"Please provide email and password both")
   }

    const user = await User.findOne({Username})

    if(!user){
         return res.status(404).send({message:"Inavlid Username"})
    }

    const isPassword = await user.isPasswodCorrect(password)
    console.log(isPassword);
    if (!isPassword) {
        return res.status(401).send({message:"Inavlid Password"})
   }
 
    await User.findOneAndUpdate({Username},{
        isLoggedIn:true
    })
     const {refreshtoken,accessToken}= await genrateAccessAndRefreshToken(user._id)

    const option ={
        httpOnly:true,
        secure: true, // Use secure cookies in production
   }

//    console.log(accessToken,refreshtoken);

 return res.cookie('refreshtoken', refreshtoken, option)
    .cookie('accessToken', accessToken, option).json(
        new ApiResponse(200,{user},'LogedIn Successfully')
    )
})

// const login = asyncHandler(async (req, res) => {
//     const { Username, password } = req.body;

//     if (!Username || !password) {
//         throw new ApiError(400, "Please provide both username and password");
//     }

//     const user = await User.findOne({ Username });

//     if (!user) {
//         return res.status(404).send({ message: "Invalid Username" });
//     }

//     const isPassword = await user.isPasswodCorrect(password)
//         console.log(isPassword);
//         if (!isPassword) {
//             return res.status(401).send({message:"Inavlid Password"})
//         }
//     await User.findOneAndUpdate({ Username }, { isLoggedIn: true });

//     const { refreshtoken, accessToken } = await genrateAccessAndRefreshToken(user._id);

//     const options = {
//         httpOnly: true,
//         secure: false,
//         SameSite:'none' 
//     };

//     res.setcookie('accessToken',accessToken,options)
//     .cookie('refreshToken',refreshtoken,options)
//     .json(
//         new ApiResponse(200,{user},'User Logedin Successfully')
//     ) 

  
   
// })

// const login = asyncHandler(async (req, res) => {
//     const { Username, password } = req.body;

//     if (!Username || !password) {
//         throw new ApiError(400, "Please provide both username and password");
//     }

//     const user = await User.findOne({ Username });

//     if (!user) {
//         return res.status(404).send({ message: "Invalid Username" });
//     }

//     // Corrected the spelling of 'isPasswodCorrect' to 'isPasswordCorrect'
//     const isPassword = await user.isPasswodCorrect(password);
//     console.log(isPassword);
//     if (!isPassword) {
//         return res.status(401).send({message:"Invalid Password"});
//     }
//     await User.findOneAndUpdate({ Username }, { isLoggedIn: true });

//     const { refreshtoken, accessToken } = await genrateAccessAndRefreshToken(user._id);

//     const options = {
//         httpOnly: true,
//         secure: true,
//         SameSite:'None', // 'None' should be capitalized
//         path: '/', // Added path
//     };

//     // Added 'secure' option based on the request protocol
//     // if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
//     //     options.secure = true;
//     // }

//   return res.cookie('abhi','abhishek').send({message:'User Logedin'})

//     // res.cookie('accessToken', accessToken, options)
//     // .cookie('refreshToken', refreshtoken, options)
//     // .json(
//     //     new ApiResponse(200, {user}, 'User Logged in Successfully') // Corrected 'Logedin' to 'Logged in'
//     // );
// });


const logout = asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(req.user._id,
    {
        $unset:{
            refreshtoken:1
        }
    },
    {
        new:true
    }
) 

const option ={
    httpOnly:true,
    secure:false,
}

res.clearCookie("refreshtoken")
.clearCookie("accessToken")
.status(200).json(new ApiResponse(200,"User loged out"))
})

const getUserById = asyncHandler(async(req,res)=>{
    const id = req.user._id

    const user = await User.findById(id)

    if (!user) {
        throw new ApiError(404,'User Not found')
    }

    res.status(200).json(
        new ApiResponse(200,{user},'User found successFully')
    )
})

const updateAvatar = asyncHandler(async(req,res)=>{
    const avatarLoacalpath = req.files.avatar[0].path
    if (!avatarLoacalpath) {
        throw new ApiError(404,"image not found")
    }

    const avatars = await UploadOnCloudinary(avatarLoacalpath)

    if (!avatars) {
        throw new ApiError(500,'Interl Error while uploading image')
    }

    const user = await User.findByIdAndUpdate(req.user._id,{
        avatar:avatars.secure_url
    })

    res.status(200).json(
        new ApiResponse(200,{user},"image uploaded")
    )
})

export {ragister,login,logout,updateAvatar,getUserById}