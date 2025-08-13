import express from "express"
import User from "../models/usermodel.js";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import GoogleStrategy from "passport-google-oidc";
import isJWT from "jsonwebtoken";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/redirect/google',
}, async function verify(issuer, profile, cb) {
    try {
        console.log(profile);
        
        // 1. Check if a user with this Google ID already exists
        let user = await User.findOne({ googleId: profile.id });

        // 2. If user exists, we are done.
        if (user) {
            return done(null, user);
        }

        // 3. If user does not exist, create a new one
        const newUser = new User({
            googleId: profile.id,
            name: profile.displayName, // Save the user's name
            email: profile.emails[0].value, // Emails are in an array
        });

        // 4. Save the new user to the database
        await newUser.save();
        
        // 5. We are done, return the new user
        return done(null, newUser);

    } catch (err) {
        // If any error occurs during the process, pass it to Passport
        return done(err);
    }
}));

passport.use(new LocalStrategy(async function verify(username, password, cb) {
    try{
        let user = await User.findOne({email: username});
        if(!user) return cb(null, false);
        let userExist = await user.comparePassword(password);
        if(userExist) return cb(null, user);
        return cb(null, false); 
    }catch(error) {
        return cb(error);
    }
}));

router.post("/signup", async (req,res, next)=>{
    try{
        const {email, password, name} = req.body;
        if(!email || !password || !name){
            res.status(400).json({success:false, message:"Please Provide all Fields"});
        }
        let user = await User.findOne({email});
        if(user){
            res.status(400).json({success:false, message:"User Already Exists"});
        }
        const newUser = new User({email, password, name});
        await newUser.save();
        const token = isJWT.sign({id: newUser.email}, process.env.SECRET_KEY, {expiresIn: '1 days'});
        res.json({success: true, token: 'Bearer ' + token});
    }catch(error){
        console.log(error);
        next(error);
    }
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) =>{
        if(err) {
            next(err);
        }
        if (!user) {
            res.status(401).json({ success: false, message: "Invalid Credentials" });
        }
        try {
            const token = isJWT.sign({id: user.email}, process.env.SECRET_KEY, {expiresIn: '1 days'});
            res.json({sucess: true, token: 'Bearer ' + token});
        } catch (error) {
            console.log(error);
            next(error);
        }
    })(req, res, next);
});

router.get('/auth/google',
  passport.authenticate('google', {
        scope: [ 'profile','email' ],
        session: false
    }
));

router.get('/auth/redirect/google', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        if(err) next(err);
        if (!user) {
            res.status(401).json({ success: false, message: "Authentication failed" });
        }
        try {
            const token = isJWT.sign({id: user.email}, process.env.SECRET_KEY, {expiresIn: '1 days'});
            res.json({success: true, token: 'Bearer ' + token});
        } catch (error) {
            console.log(error);
            next(error);
        }
    }) (req, res, next);
});

export default router;