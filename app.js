import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))


app.use(express.json());
app.use(express.urlencoded({extended: true,limit:'16kb'}));
app.use(express.static('public'));
app.use(cookieParser())

// Import Routes

import UserRoutes from './src/routes/User.routes.js';
import HotelRoutes from './src/routes/Hotel.route.js';

// Seting the path 
app.use('/api/v1/users',UserRoutes) //For users
app.use('/api/v1/hotels',HotelRoutes) //For hotels

export default app