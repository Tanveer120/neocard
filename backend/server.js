import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoute.js";
import doctorRoutes from "./routes/doctorRoute.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI, {})
.then(() => console.log("DB Connected"))
.catch((err) => console.log("DB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
