import mongoose from "mongoose";

const MONGO_URI =
	"mongodb+srv://admin2:KTZxUYjPIYxiN8U5@cluster0.x7uc73c.mongodb.net/mern-auth";

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(MONGO_URI, {});
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
	}
};

connectDB();
