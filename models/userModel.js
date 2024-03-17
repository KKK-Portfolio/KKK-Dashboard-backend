//Core Module

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Name."],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please Enter a Valid Email."],
  },
  password: {
    type: String,
    required: [true, "Please Enter a Password"],
  },
  confirmPassword: {
    type: String,
    required: [true, "Please Confirm your Password"],
    validate: {
      validator: function (val) {
        return val == this.password;
      },
      message: "Password Doesn't match",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
