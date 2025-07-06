import express from "express";
import { registerUser, loginUser, getMe, updateUser } from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Route Example
router.get("/profile", auth, (req, res) => {
  res.json({ message: "Welcome to your profile!", userId: req.user.id });
});

router.get("/me", auth, getMe); // ✅ protected route
router.put("/update", auth, updateUser); // ✅

export default router;
