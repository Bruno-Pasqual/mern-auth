import express from "express";
import { connectDB } from "./db/connectDB.js";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:5174" }));

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);

const startServer = async () => {
	try {
		await connectDB();
		console.log("MongoDB connected successfully.");

		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Failed to connect to MongoDB. Server not started.");
		process.exit(1);
	}
};

startServer();
