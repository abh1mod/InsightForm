import mongoose from "mongoose";


const QuestionSchema = new mongoose.Schema({
  questionType: {
    type: String,
    enum: [
      'text',
      'mcq',
      'rating'
    ],
    required: true
  }, // Type of question
  questionText: { type: String, required: true }, // The text of the question
  required: { type: Boolean, default: false }, // Whether the question is mandatory
  options: [String], // applicable for MCQ, checkboxes, dropdown otherwise empty
}); 



const FormSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  isLive: { type: Boolean, default: true }, // Whether the form is active or not
  title: { type: String, required: true }, // Title of the form
  objective: { type: String, required: true }, // Objective of the form visible to the form creator
  description: { type: String, required: false }, // Description of the form visible to respondents
  questions: [QuestionSchema], // Array of questions in the form
  lastEdited: { type: Date, default: Date.now() }, // Timestamp of the last edit
  authRequired: { type: Boolean, default: true }, // Whether authentication is required to submit the form
  isAnonymous: { type: Boolean, default: false }, // Whether the form is anonymous
  reportGenerationLimit: { type: Number, default: 3 }, // Number of reports generated for the form
  reportGenerationLimitExpiry: {type: Date, default: Date.now()} // Expiry time for the report generation limit
}, { timestamps: true });

const Form = mongoose.model('Form', FormSchema);
const Report = mongoose.model('Report', ReportSchema);

export default Form;





