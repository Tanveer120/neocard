import DoctorApplication from "../models/doctorApplication.js";


export const applyDoctor = async (req, res) => {
  try {
    const { degree, specialization, experience, documents } = req.body;

    const existing = await DoctorApplication.findOne({ userId: req.user.id, status: "pending" });
    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = new DoctorApplication({
      userId: req.user.id,
      degree,
      specialization,
      experience,
      documents,
      status: "pending",
    });

    await application.save();
    res.status(200).json({ message: "Application submitted", application });
  } catch (error) {
    console.error("Doctor application error:", error);
    res.status(500).json({ message: "Failed to submit application" });
  }
};

export const checkDoctorStatus = async (req, res) => {
  try {
    const app = await DoctorApplication.findOne({ userId: req.user.id })
      .sort({ appliedAt: -1 })
      .select("status degree specialization documents");

    if (!app) {
      return res.status(200).json({ status: "none" });
    }

    return res.status(200).json({
      status: app.status,
      degree: app.degree,
      specialization: app.specialization,
      documents: app.documents,
    });
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({ message: "Unable to check doctor application status" });
  }
};

