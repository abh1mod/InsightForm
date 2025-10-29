import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to the question
    questionText: {type: String, required: true}, // The text of the question
    questionType: {type: String, required: true}, // Type of question (e.g., 'short_answer', 'multiple_choice')
    options: {type: [String], required: true}, // Options for multiple choice questions that were presented to the user
    answer: {type: String} // the answer provided by the user
}); 

const ResponseSchema = new mongoose.Schema({
    formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true, index: true}, // Reference to the form to which this response belongs
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true}, // Reference to the user who submitted the response
    userName: { type: String, required: true}, // Name of the user who submitted the response
    responses: [answerSchema], // Array of answers to the questions in the form for a single user
}, { timestamps: true });

const Response = mongoose.model('Response', ResponseSchema);

export default Response;