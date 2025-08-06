import mongoose from "mongoose";
import bcrypt from "bcryptjs"

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


//.pre("save", ...) registers a middleware (or "hook") that runs before the .save() operation.
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    try{
        this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
        next();
    }catch(error){
        next(error);
    }
})  

userSchema.method.comparePassword = async function(password){
    return bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema)
//Create a class (User) that I can use to interact with a MongoDB collection called users (lowercased & pluralized)
// if the users collection does not exist in DB MongoDB creates it automatically on first document insert

export default User;