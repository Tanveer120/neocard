import mongoose from "mongoose";

const doctorApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  degree: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  documents: [{ type: String }], // URLs to Cloudinary
  status: { type: String, default: "pending" },
  appliedAt: { type: Date, default: Date.now },
});

const DoctorApplication = mongoose.model("DoctorApplication", doctorApplicationSchema);

export default DoctorApplication;
