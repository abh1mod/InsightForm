import express from "express"
import {Form} from "../models/form.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import {callAI as generateSuggestions} from "../services/AI.js";
import { questionSuggestionPrompt, questionSuggestionResponseSchema } from "../services/AI.js";
import jwtAuthorisation from "../middleware/jwtAuthorisation.js";
const router = express.Router();

// Middleware to parse JSON and URL-encoded data
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// middleware to verify JWT token and attach user to request. refer to ../middleware/jwtAuthorisation.js for implementation
router.use(jwtAuthorisation);

// This route retrieves all forms created by the authenticated user, sorted by the most recently updated.
// It returns the form title and its live status.
// If no forms are found, it returns a message indicating that no forms were found.
router.get("/userForms", async (req, res, next) => {
    try{
        let formData =  await Form.find({userId: req.user.id}).sort({updatedAt: -1}).select("title isLive isAnonymous authRequired");
        if(!formData || formData.length === 0){
            return res.status(200).json({success:false, message:"No Forms Found"});
        }
        return res.json({success:true, forms: formData});
    }
    catch(error){
        console.log(error);
        next(error);
    }
});

// This route retrieves a specific form by its ID.
// It returns the entire form data including its questions and other details.
// If the form is not found, it passes onto the next error handler.
router.get("/userForms/:formId", async (req, res, next) => {
    try{
        const {formId} = req.params;
        const formData = await Form.findOne({_id: formId, userId: req.user.id});
        return res.json({success:true, form: formData});
    }
    catch(error){
        console.log(error);
        next(error);
    }
});

// This route allows the authenticated user to create a new empty form only.
// it is sent as a POST request with the form title and objective in the body.
// It returns the created form id and success status.
router.post("/userForms", async (req, res, next) => {
    try{
        const {title, objective} = req.body;
        if(!title || !objective){
            return res.status(400).json({success:false, message:"Please Provide Title and Objective"});
        }
        const newForm = new Form({
            userId: req.user.id,
            title,
            objective,
            questions: []
        });
        await newForm.save();
        return res.json({success:true, formId: newForm._id});
    }
    catch(error){
        console.log(error);
        next(error);
    }
});

// This route allows the authenticated user to update an existing form by its ID.
// this route will expect the react state object of the form to be sent in the body which is of same structure as the Form model.
// It updates the form with the provided data and returns the status of the operation.
router.patch("/userForms/:formId", async (req, res,next) => {
    try{
        const formBody = req.body.formBody; // The form data to be updated
        const formId = req.params.formId; // The ID of the form to be updated
        //`runValidators: true` ensures the new object conforms to your schema.
        // `new: true` returns the updated document.
        const options = {new: true , runValidators: true };
        const updatedForm = await Form.findOneAndReplace({_id: formId, userId: req.user.id}, formBody, options); // Replace the form with the new data
        if (!updatedForm) {
            return res.status(404).json({ success: false, message: "Form not found or you are not authorized to edit." });
        }
        return res.json({success:true, form: updatedForm}); // Return the updated form
    }
    catch(error){
        console.log(error);
        next(error);
    }
});

// This route allows the authenticated user to delete a form by its ID.
router.delete("/userForms/:formId", async (req, res, next) => {
    try{
        const formId = req.params.formId; // The ID of the form to be deleted
        // Find the form by ID and delete it
        const deletedForm = await Form.findOneAndDelete({ _id: formId, userId: req.user.id });
        // If no form is found, return a 404 error
        if (!deletedForm) {        
            return res.status(404).json({success: false, message: "Form not found"});
        }
        // If the form is successfully deleted, return a success message
        return res.json({success:true, message: "Form deleted successfully"});
    }
    catch(error){
        console.log(error);
        next(error);
    }
});

// This route generates AI-based question suggestions for a specific form based on its objective and existing questions.
// It uses the Google Gemini API to generate 3 new, relevant, and distinct questions.
// The route expects the form ID as a URL parameter and returns the suggested questions in the response.
// it uses the callAI function from AIMiddlewares.js to interact with the AI service. (refer implementation in AIMiddlewares.js)
// it uses the questionSuggestionPrompt function to structure the prompt for the AI service. (refer implementation in AIMiddlewares.js)
// it uses the questionSuggestionResponseSchema to get strucutred AI response. (refer implementation in AIMiddlewares.js)
router.get("/:formId/suggestQuestions", async (req, res, next) =>{
    try{
        const formId = req.params.formId;
        const formData = await Form.findOne({_id: formId, userId: req.user.id}).select("objective questions");
        if(!formData){
            return res.status(404).json({success:false, message:"Form Not Found"});
        }
        const objective = formData.objective;
        const existingQuestions = formData.questions;
        const neededQuestionData = existingQuestions.map(q => {
            return {questionType: q.questionType, questionText: q.questionText};
        });
        const structuredPrompt = questionSuggestionPrompt(objective, neededQuestionData);
        const response = await generateSuggestions(structuredPrompt, questionSuggestionResponseSchema);
        console.log(response.text);
        const responseData = JSON.parse(response.text);
        console.log(responseData);
        
        if(!responseData || !responseData.suggestions){
            return res.status(500).json({success:false, message:"Failed to get suggestions from AI"});
        }
        return res.json({success:true, suggestions: responseData.suggestions}); 
    }
    catch(error){
        next(error);
        console.log(error);
        return res.status(500).json({success:false, message:error.message});
    }
});


export default router;

