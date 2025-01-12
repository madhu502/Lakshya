const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trim: true,
  },
  lname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    default: null,
    unique:true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  isAdmin:{         //model for admin
    type:Boolean,
    default: false,

  },
  resetPasswordOTP:{  // model for otp
    type:Number,
    default:null,
    
  },
  resetPasswordExpires:{ // model for otp expiry time
    type:Date,
    default:null,
    
  },

});

const User = mongoose.model("user", userSchema);

module.exports = User;
