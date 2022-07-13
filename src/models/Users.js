const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      validate(value) {
        if (validator.isNumeric(value)) {
          throw new ValidationError("Invalid UserName");
        }
      },
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
      },
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
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    try {
      user.password = await bcrypt.hash(user.password, 8);
    } catch (e) {
      res.send(e);
    }
  }
  next();
});
userSchema.methods.getAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  console.log(user);
  await user.save();

  return token;
};
userSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Password mismatch");
  }
  return user;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
