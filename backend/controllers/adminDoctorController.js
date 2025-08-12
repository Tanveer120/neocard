import DoctorApplication from "../models/doctorApplication.js";
import User from "../models/userModel.js";
import Doctor from "../models/doctorModel.js";

// Get all pending doctor applications
export const getAllPendingApplications = async (req, res) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({ message: "Access denied" });
//   }

  try {
    const applications = await DoctorApplication.find({ status: "pending" }).populate("userId", "firstName lastName email phoneNumber");
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

// Approve or reject a doctor application
export const updateDoctorApplicationStatus = async (req, res) => {
  
const { id } = req.params;

  try {
    const application = await DoctorApplication.findById(id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    if (application.status === "approved")
      return res.status(400).json({ message: "Application already approved" });

    // Update status to approved
    application.status = "approved";
    await application.save();

    const user = await User.findById(application.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if doctor already exists to avoid duplicates
    const exists = await Doctor.findOne({ userId: user._id });
    if (!exists) {
      await Doctor.create({
        userId: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        degree: application.degree,
        specialization: application.specialization,
        experience: application.experience,
        documents: application.documents,
      });
    }

    res.status(200).json({ message: "Doctor application approved and added to system." });
  } catch (err) {
    console.error("Approval error:", err);
    res.status(500).json({ message: "Server error during approval" });
  }
};
