import mongoose from "mongoose";


const QuestionSchema = new mongoose.Schema({
  questionType: {
    type: String,
    enum: [
      'text',
      'mcq',
      'rating',
      'number',
    ],
    required: true
  }, // Type of question
  questionText: { type: String, required: true }, // The text of the question
  required: { type: Boolean, default: false }, // Whether the question is mandatory
  options: [String], // applicable for MCQ, checkboxes, dropdown otherwise empty
  min: {
    type: Number,
    // 'this' refers to the document being validated
    required: [
      function() { return this.questionType === 'number'; },
      'Minimum value is required for number-based questions'
    ],
    default: null
  },
  max: {
    type: Number,
    required: [
      function() { return this.questionType === 'number'; },
      'Maximum value is required for number-based questions'
    ],
    default: null,
    // You can also add validation to ensure max is greater than min
    validate: [
      function(value) {
        // Only run validation if both values are present
        if (this.questionType === 'number' && this.min !== null && value !== null) {
          return value > this.min;
        }
        return true; // Pass validation if not a number question or values are missing
      },
      'Maximum value must be greater than the minimum value'
    ]
  }
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

export default Form;





