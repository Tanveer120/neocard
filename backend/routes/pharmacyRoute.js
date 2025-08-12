import express from "express";
import auth from "../middleware/auth.js";
import { applyPharmacy, checkPharmacyStatus } from "../controllers/pharmacyController.js";
import { getAllPendingPharmacyApplications, updatePharmacyApplicationStatus } from "../controllers/adminPharmacyController.js";

const router = express.Router();

router.post("/apply", auth, applyPharmacy);
router.get("/check-status", auth, checkPharmacyStatus);
router.get("/admin/pending-applications", getAllPendingPharmacyApplications);
router.put("/admin/application/:id/status", updatePharmacyApplicationStatus);

export default router; 