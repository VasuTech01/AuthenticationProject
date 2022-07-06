const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        validate(value) {
            if (validator.isNumeric(value)) {
                throw new ValidationError("Invalid UserName");
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email ");
            }
        }        
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Invalid Password");
            }
        }
    }
}, {
    timestamps:true,
})

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified('password')) {
          
        user.password=await bcrypt.hash(user.password,8);
    }
    next();    
})




const User = mongoose.model("User", userSchema);
module.exports = User;
