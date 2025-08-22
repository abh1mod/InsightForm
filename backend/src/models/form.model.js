import mongoose from "mongoose";


const QuestionSchema = new mongoose.Schema({
  questionType: {
    type: String,
    enum: [
      'short_answer',
      'paragraph',
      'multiple_choice',
      'checkboxes',
      'dropdown',
      'file_upload',
      'date',
      'time'
    ],
    required: true
  }, // Type of question
  questionText: { type: String, required: true }, // The text of the question
  required: { type: Boolean, default: false }, // Whether the question is mandatory
  options: [String], // applicable for MCQ, checkboxes, dropdown otherwise empty
}); 

const SuggestionSchema = new mongoose.Schema(
  {
    title: String, // Short heading for suggestion
    detail: String, // Detailed description of the suggestion
    suggestionType: String, // Optional: e.g., "insight", "action", "warning"
  },
  { _id: false }
);

const ReportSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  responseCount: { type: Number, required: true }, // Snapshot of response count when report was generated
  summary: String, // Summary of the responses
  suggestions: [SuggestionSchema], // Array of suggestions based on the responses
}, { timestamps: true });

const FormSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  isLive: { type: Boolean, default: true }, // Whether the form is active or not
  title: { type: String, required: true }, // Title of the form
  objective: { type: String, required: true }, // Objective of the form
  questions: [QuestionSchema], // Array of questions in the form
  isAnonymous: { type: Boolean, default: false }, // Whether the form is anonymous
  //controls for report generation
  reportTryCount: { type: Number, default: 3 }, // Number of tries left for generating reports
  lastReportResponseCount: { type: Number, default: 0 } // Last known response count when report was generated
}, { timestamps: true });

const Form = mongoose.model('Form', FormSchema);
const Report = mongoose.model('Report', ReportSchema);

export {Form, Report};





