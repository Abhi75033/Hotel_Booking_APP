
import app from './app.js'
import ConnectDB from './src/db/Connection.db.js';
import dotenv from 'dotenv'


dotenv.config({
    path: './.env',
})

ConnectDB()
.then(()=>{
    app.listen(process.env.PORT || 3000,()=>console.log(`Server started at ${process.env.PORT}`))
  })
  .catch((error)=>{
    console.log(error);
  })




