import express from "express";
import { connectDB } from "./db/connectDB.js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use(express.json()); // allows us to parse incoming requests with JSON payloads

app.listen(PORT, () => {
	connectDB();
	console.log("Server is running on port " + PORT);
});
