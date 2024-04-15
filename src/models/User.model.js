import monngoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const UserSchema = new monngoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    
    avatar:{
        type:String,
    },
    CoverImage:{
        type:String
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    refreshtoken:{
        type:String
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})


UserSchema.pre('save',async function(){
    if(!this.isModified('password')) return 
    this.password = await bcrypt.hash(this.password,10)
})

UserSchema.methods.isPasswodCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

UserSchema.methods.genrateAccessToken = async function(){
    return jwt.sign(
        {
            _id:this._id,
            email: this.email,
            password:this.password
        },
        process.env.ACCESS_TOKEN_SECRECT,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.genrateRefreshToken = async function(){
    return jwt.sign({
        _id:this.id
    },
    process.env.REFRESH_TOKEN_SECRECT,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User = monngoose.model('User',UserSchema)
