import mongoose from 'mongoose'
import {DB_NAME} from '../utils/constant.js'

const ConnectDB = async()=>{
    try {
        const connctionInstance = await mongoose.connect(`${process.env.MONGO_URI}${DB_NAME}`)
        console.log(`MongoDB connected: ${connctionInstance.connection.host}`);
    } catch (error) {
       console.log(`MongoDB connection failed: ${error}`); 
       process.exit(1)
    }
}

export default ConnectDB