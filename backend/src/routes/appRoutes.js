import express from "express"
import User from "../models/usermodel.js";
const router = express.Router();

router.post("/signup", async (req,res)=>{
    try{
        const {email, password, name} = req.body;
        if(!email || !password || !name){
            return res.status(404).send({success:false, message:"Please Provide all Fields"});
        }
        const userExists = await User.findOne({email : email});
        if(userExists){
            return res.status(400).json({success:false, message:"User Already Exists"});
        }
        const user = await User.create({name, email, password});

        res.status(201).send({user, message : "User Profile Created Successfully"});
    }catch(error){
        console.log(error);
        res.status(500).send({success:false, message:"Internal Server Error"});
    }
    
});


export default router;