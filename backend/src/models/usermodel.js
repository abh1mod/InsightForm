import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required:[true, "Name is required"],
    },
    email:{
        type:String,
        required: [true, "Email is required"],
        unique:true,
        lowercase:true,
        trim :true,
    },
    password:{
        type:String,
        required:[true, "Password is required"],
        minlength:[6,"Password must be 6 character long"]
    }
},
{
    timestamps:true,
});

const User = mongoose.model("User", userSchema)

export default User;