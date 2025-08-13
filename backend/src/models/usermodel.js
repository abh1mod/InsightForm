import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from 'validator';

const userSchema = new mongoose.Schema({
    name:{
        type : String,
        required:[true, "Name is required"],
    },
    email:{
        type:String,
        required: [true, "Email is required"],
        unique:true, // Ensure that the email is unique across all users
        lowercase:true, // Convert email to lowercase before saving
        index: true, // Create an index on the email field for faster lookups
        trim :true, // Remove whitespace from both ends of the string    
        validate: [validator.isEmail, "Please provide a valid email"] // Validate that the email is in a valid format
    },
    password:{
        type:String,
        required: [function() {
            // Make password required only if the user is not signing up with Google.
            return !this.googleId;
        }, 'Password is required'],
        minlength:[6,"Password must be 6 character long"]
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // Creates a unique index but allows multiple documents to have a null value
    }
},
{
    timestamps:true, // Automatically add createdAt and updatedAt fields
});


//.pre("save", ...) registers a middleware (or "hook") that runs before the .save() operation and save hashed passwords to DB.
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    try{
        this.password = await bcrypt.hash(this.password, await bcrypt.genSalt(10));
        next();
    }catch(error){
        next(error);
    }
})  

// Method to compare the provided password with the hashed password stored in the database
// This method can be called on an instance of the User model to verify a password during login
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model("User", userSchema);

export default User;