import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGODB_URL);

export const db = mongoose.connection;

db.on('connected',(err)=>{
    if(err){
        console.log(err.message);
    }else{
        console.log("Database connected.");        
    }
})

