import mongoose from 'mongoose';

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
  summary: String, // Summary of the responses
  suggestions: [SuggestionSchema], // Array of suggestions based on the responses
}, { timestamps: true });

const Report = mongoose.model('Report', ReportSchema);

export default Report;