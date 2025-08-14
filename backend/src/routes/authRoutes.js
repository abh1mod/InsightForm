import express from "express"
import User from "../models/usermodel.js";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth20";
import isJWT from "jsonwebtoken";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/redirect/google',
}, async function verify(accessToken, refreshToken, profile, cb) {
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
        // Check if the user exists in the database
        let user = await User.findOne({email: username});
        // If user does not exist, return false
        if(!user) return cb(null, false);
        // If user exists, compare the password
        let userExist = await user.comparePassword(password);
        // If password matches, return the user
        if(userExist) return cb(null, user);
        // If password does not match, return false
        return cb(null, false); 
    }catch(error) {
        // If any error occurs during the process, pass it to Passport
        return cb(error);
    }
}));

router.post("/signup", async (req,res, next)=>{
    try{
        const {email, password, name} = req.body;
        if(!email || !password || !name){
            // If any field is missing, return an error
            return res.status(400).json({success:false, message:"Please Provide all Fields"});
        }
        let user = await User.findOne({email});
        if(user){
            // If user already exists, return an error
            return res.status(400).json({success:false, message:"User Already Exists"});
        }
        // If user does not exist, create a new user
        const newUser = new User({email, password, name});
        await newUser.save();
        // Generate a JWT token for the new user
        const token = isJWT.sign({id: newUser._id}, process.env.SECRET_KEY, {expiresIn: '1 days'});
        return res.json({success: true, token: 'Bearer ' + token});
    }catch(error){
        console.log(error);
        return next(error);
    }
});

router.post("/login", (req, res, next) => {
    // Use Passport's local strategy to authenticate the user
    passport.authenticate("local", { session: false }, (err, user, info) =>{
        if(err) {
            return next(err);
        }
        // If user is not found or password is incorrect, return an error
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" });
        }
        try {
            // If user is found, generate a JWT token
            const token = isJWT.sign({id: user._id}, process.env.SECRET_KEY, {expiresIn: '1 days'});
            return res.json({sucess: true, token: 'Bearer ' + token});
        } catch (error) {
            console.log(error);
            return next(error);
        }
    })(req, res, next);
});

// frontend will redirect to this route to initiate Google authentication
// This will redirect the user to Google's OAuth 2.0 server
router.get('/google',
  passport.authenticate('google', {
        scope: [ 'profile','email' ],
        session: false, // Disable session support
    }
));

// This is the callback route that Google will redirect to after authentication
// It will handle the response from Google and generate a JWT token
// If the user is authenticated successfully, it will return a token
// If the user is not authenticated, it will return an error
router.get('/redirect/google', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        if(err) return next(err);
        if (!user) {
            return res.status(401).json({ success: false, message: "Authentication failed" });
        }
        try {
            const token = isJWT.sign({id: user._id}, process.env.SECRET_KEY, {expiresIn: '1 days'});
            return res.json({success: true, token: 'Bearer ' + token});
        } catch (error) {
            console.log(error);
            return next(error);
        }
    }) (req, res, next);
});

export default router;