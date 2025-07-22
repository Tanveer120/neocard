import express from "express";
import {initiateRegistration, completeRegistration, loginUser, getMe, updateUser, adminLogin } from "../controllers/userController.js";
import auth from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const userRouter = express.Router();

// userRouter.post("/register", registerUser);
userRouter.post("/register/initiate", initiateRegistration);
userRouter.post("/register/complete", completeRegistration);
userRouter.post("/login", loginUser);

// Protected Route Example
userRouter.get("/profile", auth, (req, res) => {
  res.json({ message: "Welcome to your profile!", userId: req.user.id });
});

userRouter.get("/admin-only", auth, requireAdmin, (req, res) => {
  res.send("Welcome Admin");
});

userRouter.get("/me", auth, getMe); // ✅ protected route
userRouter.put("/update", auth, updateUser); // ✅


userRouter.post("/admin", adminLogin);

export default userRouter;
