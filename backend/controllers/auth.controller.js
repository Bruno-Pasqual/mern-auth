import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
	const { email, password } = req.body;

	try {
		if (!email || !password) {
			throw new Error("All fields are required");
		}

		const userAlreadyExists = await User.findOne({ email });

		if (userAlreadyExists)
			return res.status(400).json({ message: "User already exists" });
		const hashedPassword = await bcrypt.hash(password, 10);
		const verificationToken = Math.floor(
			100000 + Math.random() * 9000
		).toString();

		const user = new User({
			email,
			password: hashedPassword,
			name,
			verificationToken,
			verificationTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000,
		});

		await user.save();
		//jwt

		generateTokenAndSetCookie(res, user._id);
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};

export const login = async (req, res) => {
	res.send("Login route");
};

export const logout = async (req, res) => {
	res.send("Logout route");
};
