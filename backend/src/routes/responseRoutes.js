import express from "express"
import User from "../models/usermodel.js";
import Form from "../models/form.model.js";
import mongoose from "mongoose";
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/viewForms/:formId", async (req, res) => {
    try{
        const formId = req.params.formId;
        const formData = await Form.findOne({_id: formId, isLive: true}).select("title questions");
        if(!formData){
            return res.status(404).json({success: false, message: "Form Not Found"});
        }
        return res.json({success: true, form: formData});
    }
    catch(error){
        console.log(error);
        return next(error);
    }
});

// This route allows the exisitng user in the system to submit a response to a specific form.
// It expects the form ID in the URL and the response data in the request body.
// responseData should be the same as the structure defined in response.model.js
router.post("/submitResponse/:formId", async (req, res) => {
    const responseData = req.body.responseData;
    const formId = req.params.formId;
    if(!responseData){
        return res.json({sucess: false, message: 'No response Data'});
    }
    if(!responseData.userId) {
        return res.json({success: false, message: 'User ID is required'});
    }
    try{
        const form = await Form.findOne({ _id: formId, isLive: true });
        if(!form){
            return res.status(404).json({success: false, message: "Form Not Found or Not Live"});
        }
        const user = await User.findById(responseData.userId);
        if(!user){
            return res.status(404).json({succes: false, message: "User not found"});
        }

        
    }
    catch(error){
        console.log(error);
        return next(error);
    }
});

export default router