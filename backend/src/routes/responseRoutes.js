import express from "express"
import User from "../models/user.model.js";
import {Form} from "../models/form.model.js";
import Response from "../models/response.model.js";
import limiter from "../middleware/rateLimiter.js";
import mongoose from "mongoose";
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

function isNumberBetween1And5(str) {
  // 1. Convert the string to a number
  const num = Number(str);

  // 2. Check if it's a valid number and within the range
  //    - !isNaN(num) checks if the string was a number at all.
  //    - num >= 1 && num <= 5 checks the range.
  return !isNaN(num) && num >= 1 && num <= 5;
}

// This route allows users to view a specific form by its ID.
// It checks if the form is live and returns the form details i.e. title and questions.
router.get("/viewForms/:formId", async (req, res) => {
    try{
        const formId = req.params.formId;
        const formData = await Form.findOne({_id: formId});
        // if formId is not valid
        if(!formData){
            return res.status(404).json({success: false, message: "Form Not Found"});
        }
        // if form is not live
        if(formData && !formData.isLive){
            return res.status(403).json({success: false, message: "Form is not live"});
        }
        return res.json({success: true, form: {title : formData.title, description: formData.description, questions: formData.questions, authRequired : formData.authRequired}}); // return only title, description and questions
    }
    catch(error){
        console.log(error);
        return res.status(500).json({success:false, message:"Error fetching form"});
    }
});

// This route allows the user to submit a response to a specific form.
// It expects the form ID in the URL and the response data in the request body.
// responseData should be the same as the structure defined in response.model.js
router.post("/submitResponse/:formId", limiter, async (req, res) => {
    try{
        const formId = req.params.formId; // the form ID from the URL
        // if formId is not valid or not live
        const form = await Form.findOne({ _id: formId, isLive: true });
        if(!form){
            return res.status(404).json({success: false, message: "Form Not Found or Not Live"});
        }
        const responseData = req.body.responseData; // the response data from the user
        // if responseData is not present
        if(!responseData){
            return res.json({sucess: false, message: 'No response Data'});
        }
        // if form requires authentication, check if userId is present in responseData and valid
        // also check if user has already submitted response to this form
        if(form.authRequired){
            if(!responseData.userId) {
                return res.json({success: false, message: 'User ID is required'});
            }
            const user = await User.findById(responseData.userId);
            if(!user){
                return res.status(404).json({succes: false, message: "User not found"});
            }
            const response_userId = await Response.findOne({formId: formId, userId: responseData.userId});
            if(response_userId){
                return res.status(400).json({success: false, message: "User has already submitted response"});
            }
        }
        else{
            responseData.userId = null; // if form does not require authentication, set userId to null
        }
        // if form questions and responseData.responses length do not match then return error
        if(form.questions.length !== responseData.responses.length){
            return res.status(400).json({success: false, message: "Response does not match form questions"});
        }
        // validate each response in responseData.responses
        for(let i = 0; i < responseData.responses.length; i++){
            const question = form.questions[i];
            const answer = responseData.responses[i];
            // check if questionId and questionType match
            if(question._id.toString() !== answer.questionId.toString()){
                return res.status(400).json({success: false, message: 'Question id mismatch for question', questionId: answer.questionId});
            }
            if(question.questionType !== answer.questionType){
                return res.status(400).json({success: false, message: 'Question type mismatch for question', questionId: answer.questionId});
            }
            const answerText = answer.answer.trim();
            if(answerText === "" && !question.required){
                continue; // Skip empty answers for non-required questions
            }
            // if question is MCQ then check if answer is one of the options
            // if question is rating then check if answer is a number between 1 and 10
            // if question is short_answer then check if answer is not empty
            if(answer.questionType === "mcq" && !question.options.includes(answer.answer)){
                return res.status(400).json({success: false, message: 'not correct response', questionId: answer.questionId});
            }
            else if(answer.questionType === "rating" && isNumberBetween1And5(answer.answer) === false){
                return res.status(400).json({success: false, message: 'not correct response', questionId: answer.questionId});
            }
            else if(answer.questionType === "text" && answerText.length === 0){
                return res.status(400).json({success: false, message: 'not correct response', questionId: answer.questionId});
            }
        }
        // if auth is required and form is anonymous then put userId as null in responseData
        if(form.authRequired && form.isAnonymous){
            responseData.userId = null;
        }
        const response = new Response({
            formId: formId,
            userId: responseData.userId,
            responses: responseData.responses
        });
        await response.save();
        return res.status(201).json({success: true, message: "Response submitted successfully"});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({success:false, message:"Error submitting response"});
    }
});

export default router