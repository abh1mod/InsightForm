import express from "express"
import User from "../models/usermodel.js";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import isJWT from "jsonwebtoken";
const router = express.Router();

passport.use(new LocalStrategy(function verify(username, password, cb) {
    try{
        User.findOne({email: username}, async (err, user) =>{
            if(err) return cb(err);
            if(!user) return cb(null, false);
            let ans = await User.method.comparePassword(password, user.password);
            if(ans) return cb(null, user);
            return cb(null, false);
        });
    }catch(error) {
        return cb(error);
    }
}));

router.post("/signup", async (req,res)=>{
    try{
        const {email, password, name} = req.body;
        if(!email || !password || !name){
            return res.status(400).json({success:false, message:"Please Provide all Fields"});
        }
        passport.authenticate("local", { session: false }, async (err, user, info) => {
            if(err) next(err);
            if(user){
                return res.status(400).json({success:false, message: "User already exists. Please login"});
            }
            const newUser = new User({email, password, name});
            await newUser.save();
            const token = isJWT.sign({id: newUser.email}, process.env.PRIV_KEY, {algorithm: 'RS256', expiresIn: '1 days'});
            res.json({success: true, token: 'Bearer ' + token});
        });
    }catch(error){
        console.log(error);
        next(error);
    }
});

router.post("/login", passport.authenticate("local", { session: false }), async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" });
        }
        const token = isJWT.sign({id: user.email}, process.env.PRIV_KEY, {algorithm: 'RS256', expiresIn: '1 days'});
        res.json({sucess: true, token: 'Bearer ' + token});
    } catch (error) {
        console.error(error);
        next(error);
    }
});

export default router;