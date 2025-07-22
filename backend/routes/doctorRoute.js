import express from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import { applyDoctor, checkDoctorStatus } from "../controllers/doctorController.js";
import { getAllPendingApplications, updateDoctorApplicationStatus } from "../controllers/adminDoctorController.js";
import adminAuth from "../middleware/adminAuth.js";


const router = express.Router();

router.post("/apply", auth, applyDoctor); // No multer if already uploading to Cloudinary on frontend
router.get("/check-status", auth, checkDoctorStatus);
router.get("/admin/pending-applications", getAllPendingApplications); // Requires admin role
router.put("/admin/application/:id/status", updateDoctorApplicationStatus);

export default router;
