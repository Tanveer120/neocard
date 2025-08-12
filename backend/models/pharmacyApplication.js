import mongoose from "mongoose";

const pharmacyApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pharmacyName: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  experience: { type: Number, required: true },
  documents: [{ type: String }], // URLs to Cloudinary
  status: { type: String, default: "pending" },
  appliedAt: { type: Date, default: Date.now },
});

const PharmacyApplication = mongoose.model("PharmacyApplication", pharmacyApplicationSchema);

export default PharmacyApplication; 