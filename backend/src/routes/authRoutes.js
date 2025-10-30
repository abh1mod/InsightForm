import dotenv from "dotenv";
dotenv.config();
import { TransactionalEmailsApi, SendSmtpEmail } from "@getbrevo/brevo";
import limiter from "../middleware/rateLimiter.js";
import express from "express"
import User from "../models/user.model.js";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth20";
import isJWT from "jsonwebtoken";
import crypto from "crypto";
const router = express.Router();
import jwtAuthorisation, {blockIfLoggedIn} from "../middleware/jwtAuthorisation.js";

let emailAPI = new TransactionalEmailsApi();
emailAPI.authentications.apiKey.apiKey = process.env.SMTP_PASS;


// const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5000";

async function sendMyEmail(toEmail, toName, fromEmail, fromName, subject, htmlContent) {

  const message = new SendSmtpEmail(); // Create the email object

  message.subject = subject;
  message.htmlContent = htmlContent;
  message.sender = { email: fromEmail, name: fromName };
  message.to = [{ email: toEmail, name: toName }];

  try {
    const data = await emailAPI.sendTransacEmail(message);
    console.log('Email sent successfully. API returned:', data);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('email failure');
  }
}

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.API_URI}/api/auth/redirect/google`,
}, async function verify(accessToken, refreshToken, profile, done) {
    try {
        console.log(profile);
        
        // 1. Check if a user with this Google ID already exists
        let user = await User.findOne({ googleId: profile.id });

        // 2. If user exists, we are done.
        if (user) {
            return done(null, user);
        }
         
        // If user does not exist, check if a user with this email already exists
        // This is to handle the case where a user has already previously signed up with email and password
        // and is now trying to sign in with Google
        let user1 = await User.findOne({ email: profile.emails[0].value });

        if(user1) {
            // in case the user has created the account with local sign up but hasnt verified their account yet, we make it verified now 
            if(!user1.isVerified){
                user1.isVerified = true;
                await user1.save();
            }
            return done(null, user1)
        }


        // 3. If user does not exist, create a new one
        const newUser = new User({
            googleId: profile.id,
            name: profile.displayName, // Save the user's name
            email: profile.emails[0].value, // Emails are in an array
            isVerified: true // Since the email is verified by Google, we can mark it as verified
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

router.post("/signup", limiter, blockIfLoggedIn, async (req,res)=>{
    try{
        const {email, password, name} = req.body;
        const FRONTEND_URL = req.get('origin');
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
        const verificationToken = newUser.generateVerificationToken();
        await newUser.save();
        
        // Send verification email
        try{
            const verificationUrl = `${FRONTEND_URL}/verify/${verificationToken}`; // frontend URL for email verification that would in turn call this route on backend
            await sendMyEmail(newUser.email, newUser.name, process.env.EMAIL_USER, "InsightForm", 'Email Verification', `<p>Please click the following link to verify your email, link is valid for 15 minutes:</p>
                <a href="${verificationUrl}">verification url</a>`);

            return res.status(201).json({success:true, message:"Please check your email to verify your account."});
        }
        // If error occurs while sending email, return an error
        catch(error){
            console.log(error);
            return res.status(500).json({success:false, message:"Error sending verification email", error:error});
        }

    }catch(error){
        console.log(error);
        if(error.name === "ValidationError"){
            // 2. Check if the error is specifically for the 'password' field
            if (error.errors.password) {
                // 3. Send back the specific error message you defined in your schema
                return res.status(400).json({
                    success: false,
                    message: error.errors.password.message // e.g., "Password must be 6 characters long"
                });
            }
        }
        return res.status(500).json({success:false, message:"Error signing up"});
    }
});

router.post("/login", limiter, blockIfLoggedIn, (req, res) => {
    // Use Passport's local strategy to authenticate the user
    passport.authenticate("local", { session: false }, (err, user, info) =>{
        if(err) {
            return res.status(500).json({ success: false, message: "Server Error" });
        }
        console.log(user);
        // If user is not found or password is incorrect, return an error
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid Credentials" });
        }
        try {
            // Check if the user's email is verified
            if(!user.isVerified){
                return res.status(401).json({success: false, message: "Email not verified"});
            }
            // If user is found and is verified, generate a JWT token
            const token = isJWT.sign({id: user._id}, process.env.SECRET_KEY, {expiresIn: '1 days'});
            return res.json({sucess: true, token: token});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "Error Logging in" });
        }
    })(req, res);
});

// frontend will redirect to this route to initiate Google authentication
// This will redirect the user to Google's OAuth 2.0 server
router.get('/google', blockIfLoggedIn, (req, res, next) => {
    const origin = req.query.origin || process.env.FRONTEND_URL;
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: encodeURIComponent(origin), // pass it safely to callback
        session: false
    })(req, res, next);
});

// This is the callback route that Google will redirect to after authentication
// after coming to this route, passport will exchange the authorization code for access token and fetch the user profile from Google
// then it will call the verify function defined in the GoogleStrategy above
// and then finally it will call this callback function in passport.authenticate

// If the user is authenticated successfully, it will return a token
// If the user is not authenticated, it will return an error
router.get('/redirect/google', (req, res) => {
    const FRONTEND_URL = decodeURIComponent(req.query.state);
    passport.authenticate('google', { session: false }, (err, user, info) => {
        if(err) return res.redirect(`${FRONTEND_URL}/auth/failure?error=server_error`);
        if (!user) {
            return res.redirect(`${FRONTEND_URL}/auth/failure?error=access_denied`);
        }
        try {
            const token = isJWT.sign({id: user._id}, process.env.SECRET_KEY, {expiresIn: '1 days'});
            return res.redirect(`${FRONTEND_URL}/auth/success?token=${token}`);
        } catch (error) {
            console.log(error);
            return res.redirect(`${FRONTEND_URL}/auth/failure?error=token_creation_failed`);
        }
    }) (req, res);
});

// route to verify the email using the token sent to the user's email
// once the token is verified, the user's isVerified field is set to true
// and the verificationToken and verificationTokenExpiry fields are cleared
// finally a JWT token is generated and sent to the user
router.get('/verify/:token', blockIfLoggedIn, async (req, res) => {
    try{
        const token = req.params.token;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        let user = await User.findOne({verificationToken: hashedToken, verificationTokenExpiry: {$gt: Date.now()}});
        if(!user) return res.status(400).json({success: false, message: "Invalid or Expired Token"});
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();
        const jwtToken = isJWT.sign({id: user._id}, process.env.SECRET_KEY, {expiresIn: '1 days'});
        return res.json({success: true, token: jwtToken, message: "Email Verified Successfully"});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({success:false, message:"Error verifying email"});
    }
});

// route to resend the verification email token if the user did not receive it or the token expired
// first check if the user with the given email exists and is not verified
// and daily limit is not reached and last email sent was 2 minutes ago
// if such a user exists, generate a new verification token, save it to the database
// and send a new verification email to the user
router.post('/resend-verification', limiter, blockIfLoggedIn, async (req, res) => {
    try{
        const {email} = req.body;
        const FRONTEND_URL = req.get('origin');
        if(!email) return res.status(400).json({success: false, message: "Please provide an email"});
        let user = await User.findOne({email: email, isVerified: false});
        if(!user) return res.status(400).json({success: false, message: "Error finding mail"});

        // check if user has exceeded daily limit for resending verification email
        if(user.verificationEmailAttemptsExpires < Date.now()){
            user.verificationEmailAttempts = 5; // reset attempts if expiry time has passed
            user.verificationEmailAttemptsExpires = Date.now() + 24*60*60*1000; // set new expiry time for next 24 hours
            await user.save(); // save the updated user document
        }

        // if daily limit is reached, return an error
        if(user.verificationEmailAttempts <= 0){
            return res.status(429).json({success: false, message: "Verification email resend limit reached. Please try again after 24hrs."});
        }

        // check if last email was sent less than 2 minutes ago
        const twoMinutes = 2 * 60 * 1000;
        if (user.lastTokenSentAt && (Date.now() - user.lastTokenSentAt.getTime()) < twoMinutes) {
            return res.status(400).json({success: false, message: "Please wait before requesting another verification email"});
        }
        const verificationToken = user.generateVerificationToken();
        user.lastTokenSentAt = Date.now(); // update the last sent time
        user.verificationEmailAttempts -= 1; // decrement the attempts
        await user.save();
        try{
            const verificationUrl = `${FRONTEND_URL}/verify/${verificationToken}`;
            await sendMyEmail(user.email, user.name, process.env.EMAIL_USER, "InsightForm", 'Email Verification', `<p>Please click the following link to verify your email, link is valid for 15 minutes:</p>
                <a href="${verificationUrl}">verification url</a>`);
            return res.status(200).json({success:true, message:"Verification email resent. Please check your email."});
        }
        catch(error){
            console.log(error);
            return res.status(500).json({success:false, message:"Error sending verification email"});
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({success:false, message:"server Error"});
    }
});

// route to initiate the forgot password process
// it expects the user's email in the request body
// if the email is valid and belongs to a user
// and daily limit is not reached and last email sent was 2 minutes ago,
// it generates a reset password token and sends it to the user's email
// the user can then use this token to reset their password
router.post("/forgot-password", limiter, blockIfLoggedIn, async (req, res) => {
    try{
        const email = req.body.email;
        const FRONTEND_URL = req.get('origin');
        console.log(FRONTEND_URL);
        if(!email) return res.status(400).json({success: false, message: "Please provide an email"});
        const user = await User.findOne({email: email});
        if(!user) return res.status(400).json({success: false, message: "Error finding mail"});

        // check if user has exceeded daily limit for password reset
        if(user.passwordResetAttemptsExpires < Date.now()){
            user.passwordResetAttempts = 5; // reset attempts if expiry time has passed
            user.passwordResetAttemptsExpires = Date.now() + 24*60*60*1000; // set new expiry time for next 24 hours
            await user.save(); // save the updated user document
        }

        // if daily limit is reached, return an error
        if(user.passwordResetAttempts <= 0){
            return res.status(429).json({success: false, message: "Password reset limit reached. Please try again after 24hrs."});
        }

        // check if last email was sent less than 2 minutes ago
        const twoMinutes = 2 * 60 * 1000;
        if (user.lastTokenSentAt && (Date.now() - user.lastTokenSentAt.getTime()) < twoMinutes) {
            return res.status(400).json({success: false, message: "Please wait before requesting another password reset email"});
        }
        
        const token = user.generateResetPasswordToken();
        user.lastTokenSentAt = Date.now(); // update the last sent time
        user.passwordResetAttempts -= 1; // decrement the attempts
        await user.save();
        try{
            const verificationUrl = `${FRONTEND_URL}/reset-password/${token}`;
            await sendMyEmail(user.email, user.name, process.env.EMAIL_USER, "InsightForm", 'Password Reset', `<p>Please click the following link to reset your password, link is valid for 15 minutes:</p>
                <a href="${verificationUrl}">reset password url</a>`);
            return res.status(200).json({success:true, message:"Password Reset link sent. Please check your email."});
        }
        catch(error){
            console.log(error);
            return res.status(500).json({success:false, message:"Error sending email"});
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({success:false, message:"Server Error"});
    }
});

// route to reset the password using the token sent to the user's email
// this path is called by frontend when user clicks on the reset password link in their email
// it expects the new password in the request body and the token in the URL
// if the token is valid and not expired, it updates the user's password
// and clears the reset password token and its expiry time
// finally it marks the user's email as verified (in case it was not already)
// user must login again using the new password
router.post('/reset-password/:token', blockIfLoggedIn, async (req, res) => {
    try{
        const token = req.params.token;
        const newPassword = req.body.password;
        if(!newPassword) return res.status(400).json({success: false, message: "Please provide a new password"});   
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        let user = await User.findOne({resetPasswordToken: hashedToken, resetPasswordTokenExpiry: {$gt: Date.now()}});
        if(!user) return res.status(400).json({success: false, message: "Invalid or Expired Token"});
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiry = undefined;
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();
        return res.json({success: true, message: "Password Reset Successfully"});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({success:false, message:"Error resetting password"});
    }
});

// route to check if the token is valid and the user is authenticated
// used in the case when a user manually try to go to login or signup page while being logged in
router.get('/me', jwtAuthorisation, (req, res) => {
    return res.json({success: true, userId: req.user._id});
});

export default router;