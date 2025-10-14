import express from "express";
import dotenv from "dotenv"
import { db } from "./configs/db.js";
import { User } from "./models/user.model.js";
import bodyParser from "body-parser";

dotenv.config();
const port = process.env.PORT || 8081;
const app = express();

app.use(bodyParser.urlencoded());

app.post('/user/create',(req,res)=>{
    
    User.create(req.body)
    .then((data)=>{
        return res.json(data);
    })
    .catch((error)=>{
        return res.json(error.message);
    })

});

app.get('/user/getAllUser',(req,res)=>{
    User.find({})
    .then((data)=>{
        return res.json(data);
    })
    .catch((error)=>{
        return res.json({message:error.message});
    })
})

app.listen(port,(err)=>{
    if(!err){
        console.log("Server start on port",port);
        console.log("http://localhost:"+port);                
    }
})