import mongoose from "mongoose";


const QuestionSchema = new mongoose.Schema({
  type: {
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
  },
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  options: [String], // applicable for MCQ, checkboxes, dropdown
  validation: {
    minLength: Number,
    maxLength: Number,
  }
}, { _id: true }); 

const SuggestionSchema = new mongoose.Schema({
                title: String,       // Short heading for suggestion
                detail: String,      
                type: String        // Optional: e.g., "insight", "action", "warning"
}, {_id:false});

const FormSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isLive: { type: Boolean, default: false },
  title: { type: String, required: true },
  description: { type: String },

  theme: {
    primaryColor: { type: String },
    font: { type: String }
  },
  settings: {
    allowMultipleResponses: { type: Boolean, default: true },
    collectEmail: { type: Boolean, default: false },
    confirmationMessage: { type: String, default: 'Thanks for submitting!' }
  },

  questions: [QuestionSchema],
    reportData: {
        try_cnt: Number,
        responseCount: Number,
        summary: String,            
        suggestions: [SuggestionSchema]
    },

}, { timestamps: true });

// Automatically update `updatedAt` on save
FormSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

FormSchema.index({ user_id: 1 });
FormSchema.index({ isPublished: 1, publishedAt: -1 });

const Form = mongoose.model('Form', FormSchema);


export default Form;





