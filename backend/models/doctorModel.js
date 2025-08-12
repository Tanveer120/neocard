// models/doctorModel.js
import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: String,
    email: String,
    phoneNumber: String,

    degree: String,
    specialization: String,
    experience: String,

    documents: [String], // Cloudinary URLs

    approvedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
