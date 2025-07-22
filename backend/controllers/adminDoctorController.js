import DoctorApplication from "../models/doctorApplication.js";
import User from "../models/userModel.js";

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
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const updatedApp = await DoctorApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("userId", "firstName lastName");

    res.json({ message: `Application ${status}`, application: updatedApp });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status" });
  }
};
