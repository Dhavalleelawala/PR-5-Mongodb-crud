import express from "express";
import dotenv from "dotenv"
import { db } from "./configs/db.js";

dotenv.config();
const port = process.env.PORT || 8081;
const app = express();

app.listen(port,(err)=>{
    if(!err){
        console.log("Server start on port",port);
        console.log("http://localhost:"+port);                
    }
})