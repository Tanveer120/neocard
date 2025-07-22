import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtp, verifyOtp } from "../utils/otpService.js";
import validator from "validator";
import dotenv from "dotenv";

dotenv.config();

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
// Step 1: Send OTP to user's phone
export const initiateRegistration = async (req, res) => {
  try {
    let { firstName, email, password, phoneNumber } = req.body;
    phoneNumber = `+91${phoneNumber}`;

    const exists = await User.findOne({ email });
    if (exists)
      return res.json({ success: false, message: "User already exists" });

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid Email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password should be at least 8 characters",
      });
    }

    const otpSent = await sendOtp(phoneNumber);
    if (!otpSent) {
      return res.json({ success: false, message: "Failed to send OTP" });
    }

    res.json({
      success: true,
      message:
        "OTP sent to phone number. Please verify to complete registration.",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Step 2: Verify OTP and complete registration
export const completeRegistration = async (req, res) => {
  try {
    let { firstname, lastName, email, password, phoneNumber, otp } = req.body;
    phoneNumber = `+91${phoneNumber}`;

    const isVerified = await verifyOtp(phoneNumber, otp);
    if (!isVerified) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    console.log(isVerified);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName: firstname,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      isPhoneVerified: true,
    });

    const user = await newUser.save();

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Login (handles both user and admin login)
// Login (checks DB role for admin/user)
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      res.json({
        success: true,
        message: "Userrrr logged in successfully",
        token,
      });
    } else {
      return res.json({
        success: false,
        message: "Incorrect password",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Get current logged-in user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to get user" });
  }
};

// Update user profile
export const updateUser = async (req, res) => {
  try {
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};



export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({
        success: true,
        message: "Admin logged in successfully",
        token,
      });
    } else {
      res.json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
