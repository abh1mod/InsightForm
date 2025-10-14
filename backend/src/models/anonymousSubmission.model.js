import mongoose from 'mongoose';

const AnonymousSubmissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
}, { timestamps: true });

const AnonymousSubmission = mongoose.model('AnonymousSubmission', AnonymousSubmissionSchema);

export default AnonymousSubmission;