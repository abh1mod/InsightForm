import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    // username of the user who filled the form
    userName: { 
        type: String,  
        required: true,  
    },
    // userId of the user who the form belongs to
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    // form which is being filled
    formId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Form', 
        required: true
    },
    // title of the form
    formTitle: { 
        type: String ,
        required: true
    },
    
    
}, { timestamps: true });

// expire based on createdAt
notificationSchema.index({ "createdAt": 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); 

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
