import express from "express";
import Notification from "../models/notification.model.js";
import jwtAuthorisation from "../middleware/jwtAuthorisation.js";
import User from "../models/user.model.js";
const router = express.Router();

router.use(jwtAuthorisation);

// Get notifications for the logged-in user for first time or reload using this route
router.get("/get-notifications", async (req, res) =>{
    try{
        // Fetch last checked time
        const lastchecked = await User.findOne({_id: req.user.id}).select("lastNotificationCheck");
        // Fetch notifications
        const notifications = await Notification.find({userId: req.user.id}).sort({createdAt: -1});
        let unReadCount = 0;
        // Calculate unread notifications
        notifications.forEach((notification) => {
            if(notification.createdAt > lastchecked.lastNotificationCheck){
                unReadCount += 1;
            }
        });
        return res.status(200).json({success: true, unReadCount: unReadCount, notifications: notifications, lastchecked: lastchecked.lastNotificationCheck});
    }
    catch(error){
        return res.status(500).json({success: false, message: "Internal Server Error"});
    }
});

router.patch("/mark-notifications-read", async (req, res) =>{
    try{
        const result = await User.findByIdAndUpdate({_id: req.user.id}, {lastNotificationCheck: Date.now()}, {new: true});
        console.log(result);
        
        if(!result){
            return res.status(404).json({success: false, message: "User not found"});
        }
        return res.status(200).json({success: true, message: "Notifications marked as read", lastchecked: result.lastNotificationCheck});
    }
    catch(error){
        return res.status(500).json({success: false, message: "Internal Server Error"});
    }
});

export default router;