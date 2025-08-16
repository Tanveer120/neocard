import PharmacyApplication from "../models/pharmacyApplication.js";
import User from "../models/userModel.js";
import { Pharmacy } from "../models/pharmacyModel.js";

// Get all pending pharmacy applications
export const getAllPendingPharmacyApplications = async (req, res) => {
  try {
    const applications = await PharmacyApplication.find({ status: "pending" }).populate("userId", "firstName lastName email phoneNumber");
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch pharmacy applications" });
  }
};

// Approve or reject a pharmacy application
export const updatePharmacyApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const application = await PharmacyApplication.findById(id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    if (application.status === "approved")
      return res.status(400).json({ message: "Application already approved" });

    // Update status
    application.status = status;
    await application.save();

    // If approved, create pharmacy record
    if (status === "approved") {
      const user = await User.findById(application.userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      // Check if pharmacy already exists to avoid duplicates
      const exists = await Pharmacy.findOne({ userId: user._id });
      if (!exists) {
        await Pharmacy.create({
          userId: user._id,
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          pharmacyName: application.pharmacyName,
          licenseNumber: application.licenseNumber,
          address: application.address,
          experience: application.experience,
          documents: application.documents,
        });
      }
    }

    res.status(200).json({ message: `Pharmacy application ${status}.` });
  } catch (err) {
    console.error("Pharmacy approval error:", err);
    res.status(500).json({ message: "Server error during approval" });
  }
};