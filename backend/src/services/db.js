import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config();

export const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI_LOCAL);
        console.log("MONGODB Connected Successfully");
    }
    catch(error){
        console.log("Error Connecting", error);
    }
}
