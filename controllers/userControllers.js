const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendOtp = require("../service/sendOtp");
const User = require("../model/userModel");
const path = require("path");
const fs = require("fs"); //filesystem

const registerUser = async (req, res) => {
  // 2. Destructure the incoming data
  const { fname, lname, phone, email, password } = req.body;

  // 3. validation of data (if empty, stop the process and send res)
  if (!fname || !lname || !phone || !email || !password) {
    // res.send("Please enter all fields!")
    return res.json({
      success: false,
      message: "Please enter all fields !",
    });
  }

  // 4. Error handling( Try Catch)
  try {
    // 5. Check if the user is already register
    const existingUser = await userModel.findOne({ email: email });

    // 5.1. if user found : Send response
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists!",
      });
    }

    // Hashing /Encryption of the password
    const randomSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, randomSalt);

    //5.1.1. stop the process
    //5.2 if user is new :
    const newUser = new userModel({
      //Database fields : Client's value
      fname: fname,
      lname: lname,
      phone: phone,
      email: email,
      password: hashedPassword,
    });
    // 5.2.1  Hash the password
    //5.2.2 save to the database
    await newUser.save();

    //5.2.3 send confirmation response
    return res.status(201).json({
      "success ": true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error !",
    });
  }
};

const loginUser = async (req, res) => {
  // res.send("Login API is working");

  // check incoming data
  console.log(req.body);

  // 2. Destructure the incoming data
  const { email, password } = req.body;

  // 3. validation
  if (!email || !password) {
    return res.json({
      success: false,
      message: "please enter all fields!",
    });
  }
  //4. try catch
  try {
    //find user(email)
    const user = await userModel.findOne({ email: email });

    //found data: firstname , lastname, password, email

    //not found(error messgae)
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exists!",
      });
    }

    //compare password(bcrypt)
    const isValidPassword = await bcrypt.compare(password, user.password);

    //not valid password(error)
    if (!isValidPassword) {
      return res.json({
        success: false,
        message: "Incorrect Passsowrd!",
      });
    }

    // token (generate with user data + key)
    const token = await jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );

    //response (token, user data)
    return res.status(201).json({
      success: true,
      message: "User Loggedin successfully",
      token: token,
      userData: user,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
    });
  }
};

const forgotPassword = async (req, res) => {
  console.log(req.body);
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: "Provide your Phone number",
    });
  }
  try {
    //finding user
    const user = await userModel.findOne({ phone: phone });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    // generate random 6 digit  OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // generate expiry date
    const expiryDate = Date.now() + 360000;

    // save to database for verification
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = expiryDate;
    await user.save();

    // send to register phone number
    // const isSent = await sendOtp(phone, otp);
    // if (!isSent) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Error sending otp code!",
    //   });
    // }
    // if success
    res.status(200).json({
      success: true,
      message: "OTP Send Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// verify otp ans set new password
const verifyOtpAndSetPassword = async (req, res) => {
  //get data
  const { phone, otp, newPassword } = req.body;
  if (!phone || !otp || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Required fields are missing",
    });
  }
  try {
    const user = await userModel.findOne({ phone: phone });

    // verify otp
    if (user.resetPasswordOTP != otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP!",
      });
    }
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP Expired !",
      });
    }
    // password hash
    // Hashing /Encryption of the password
    const randomSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, randomSalt);

    //update to database
    user.password = hashedPassword;
    await user.save();

    // response
    return res.status(200).json({
      success: true,
      message: " OTP varified and Password updated successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error!",
    });
  }
};
const getMe = async (req, res) => {
  const user = await userModel.findById(req.user.id).select("-password");
  return res.status(200).json({ user });
};

// getsingleuser
const getSingleUser = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const getToken = async (req, res) => {
  try {
    console.log(req.body);
    const { id } = req.body;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      success: true,
      message: "Token generated successfully!",
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};
// // Get token from model , create cookie and send response
// const sendTokenResponse = (User, statusCode, res) => {
//   const token = User.getSignedJwtToken();

//   const options = {
//     //Cookie will expire in 30 days
//     expires: new Date(
//       Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true,
//   };

//   // Cookie security is false .if you want https then use this code. do not use in development time
//   if (process.env.NODE_ENV === "proc") {
//     options.secure = true;
//   }
//   //we have created a cookie with a token

//   return res
//     .status(statusCode)
//     .cookie("token", token, options) // key , value ,options
//     .json({
//       success: true,
//       token,
//     });
// };

const uploadImage = async (req, res, next) => {
  // check for the file size and send an error message
  if (req.file.size > process.env.MAX_FILE_UPLOAD) {
    return res.status(400).send({
      message: `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
    });
  }

  if (!req.file) {
    return res.status(400).send({ message: "Please upload a file" });
  }
  res.status(200).json({
    success: true,
    data: req.file.filename,
  });
};
const updateUserProfile = async (req, res) => {
  try {
    if (req.files && req.files.image) {
      const { image } = req.files;
      const imageName = `${Date.now()}-${image.name}`;
      const imageUploadPath = path.join(
        __dirname,
        `../public/uploads/${imageName}`
      );

      // Move image to upload directory
      await image.mv(imageUploadPath);
      req.body.image = imageName;

      // Remove old image if it exists
      const existingUser = await userModel.findById(req.params.id);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (existingUser.image) {
        const oldImagePath = path.join(
          __dirname,
          `../public/uploads/${existingUser.image}`
        );

        // Check if file exists before trying to delete it
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    // Update user profile
    const updatedUserProfile = await userModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "User information updated successfully",
      user: updatedUserProfile,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({
      success: false,
      message: "User information updated successfully",
      // message: "Internal server error",
      error: error.message,
    });
  }
};
// Exporting
module.exports = {
  registerUser,
  loginUser,
  // sendTokenResponse,
  forgotPassword,
  verifyOtpAndSetPassword,
  getToken,
  getMe,
  getSingleUser,
  uploadImage,
  updateUserProfile,
};
