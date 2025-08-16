import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoute.js";
import doctorRoutes from "./routes/doctorRoute.js";
import pharmacyRoutes from "./routes/pharmacyRoute.js";
import pharmacyInventoryRoutes from "./routes/pharmacyInventoryRoute.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
app.use("/api/pharmacy-inventory", pharmacyInventoryRoutes);

// DB Connection
const mongoUri = process.env.MONGO_URI;
const connectOptions = {
	// recommended options
	useNewUrlParser: true,
	useUnifiedTopology: true,
	// fail fast if server cannot be selected
	serverSelectionTimeoutMS: 10000,
	connectTimeoutMS: 10000,
};

if (!mongoUri) {
	console.error('Missing MONGO_URI in environment. Set backend/.env with a valid MongoDB connection string.');
} else {
	mongoose
		.connect(mongoUri, connectOptions)
		.then(() => console.log('DB Connected'))
		.catch((err) => {
			console.error('DB Connection Error:', err && err.message ? err.message : err);
			// provide actionable hints for common causes
			console.error('Suggestions:');
			console.error('- Verify MONGO_URI is correct (mongodb+srv://... for Atlas or mongodb://host:port)');
			console.error('- Ensure your machine IP is whitelisted in MongoDB Atlas Network Access (or allow 0.0.0.0/0 for dev)');
			console.error('- Check firewall/proxy and that outbound port 27017 is allowed');
			console.error('- If using SRV (mongodb+srv://) ensure DNS resolution works for the host');
			console.error('- Try increasing serverSelectionTimeoutMS/connectTimeoutMS if you are on a slow network');
		});
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
