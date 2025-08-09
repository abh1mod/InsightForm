import express from "express"
import User from "../models/usermodel.js";
import Form from "../models/form.model.js";
import mongoose from "mongoose";
const router = express.Router();

router.post("/forms", async (req, res) => {
    try{
        const{user_id, title, description, questions} = req.body;
        if(!user_id || !title || !questions){
            return res.status(404).send({success:false, message:"Please provide necessary form details"});
        }
        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ error: 'Invalid user_id format' });
        }
        const userExists = await User.findOne({_id : user_id});

        if(!userExists){
            return res.status(400).json({success:false, message:"User Not Found"});
        }

        if (!Array.isArray(questions)) {
            return res.status(400).json({ error: 'Questions must be an array' });
        }
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.label  || !q.type) {
                return res.status(400).json({
                message: `Missing label or type in question at index ${i}`
            });
            }
            if(q.type == "multiple_choice" || q.type == "checkboxes" || q.type == "dropdown"){
                if(!q.options || q.options.length < 2){
                    return res.status(400).json({
                        message: `Insufficient Number of options at index ${i}`
                    })
                }
            }
        }

        const form = await Form.create({
            user_id, title, questions, description
        });
        res.status(201).send({form, success:true, message:"Form Generated Successfully"})
        
    }catch(error){
        console.log(error);
        res.status(500).send({success:false, message:"Internal Server Error"});
    }

});

export default router;

