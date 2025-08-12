import PharmacyApplication from "../models/pharmacyApplication.js";

export const applyPharmacy = async (req, res) => {
  try {
    const { pharmacyName, licenseNumber, address, phoneNumber, experience, documents } = req.body;

    const existing = await PharmacyApplication.findOne({ userId: req.user.id, status: "pending" });
    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = new PharmacyApplication({
      userId: req.user.id,
      pharmacyName,
      licenseNumber,
      address,
      phoneNumber,
      experience,
      documents,
      status: "pending",
    });

    await application.save();
    res.status(200).json({ message: "Application submitted", application });
  } catch (error) {
    console.error("Pharmacy application error:", error);
    res.status(500).json({ message: "Failed to submit application" });
  }
};

export const checkPharmacyStatus = async (req, res) => {
  try {
    const app = await PharmacyApplication.findOne({ userId: req.user.id })
      .sort({ appliedAt: -1 })
      .select("status pharmacyName licenseNumber documents");

    if (!app) {
      return res.status(200).json({ status: "none" });
    }

    return res.status(200).json({
      status: app.status,
      pharmacyName: app.pharmacyName,
      licenseNumber: app.licenseNumber,
      documents: app.documents,
    });
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({ message: "Unable to check pharmacy application status" });
  }
}; 