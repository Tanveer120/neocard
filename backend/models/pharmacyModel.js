import mongoose from "mongoose";

const pharmacySchema = new mongoose.Schema(
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
    pharmacyName: String,
    licenseNumber: String,
    address: String,
    experience: Number,
    documents: [String], // Cloudinary URLs
    approvedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);
export default Pharmacy; 