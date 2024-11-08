import bcrypt from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
} from "../mailtrap/emails.js";

export const deleteUser = async (req, res) => {
	const { id } = req.params;
	try {
		await User.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "User deleted successfully" });
	} catch (error) {
		console.log("Error deleting user: ", error);
		throw new Error("Error deleting user: ", error);
	}
};

export const logout = async (req, res) => {
	res.clearCookie("mernToken");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const verifyEmail = async (req, res) => {
	const { code } = req.body;

	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpireAt: { $gt: Date.now() },
		});
		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpireAt = undefined;
		await user.save();
		await sendWelcomeEmail(user.email, user.name);
		res.send({ success: true, message: "Email verified successfully", user });
	} catch (error) {
		console.log("Error verifying email: ", error);
		throw new Error("Error verifying email: ", error);
	}
};

export const signup = async (req, res) => {
	const { body } = req;
	const { email, password, name } = body || {};

	console.log(email, password, name);

	try {
		if (!email || !password || !name) {
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

		await sendVerificationEmail(user.email, verificationToken);

		res.status(201).json({
			success: true,
			message: "User created",
			user: { ...user._doc, password: "" },
		});
	} catch (error) {
		return res.status(500).json({ success: false, message: error.message });
	}
};
export const login = async (req, res) => {
	const { email, password } = req.body;

	console.log("backend:", email, password);

	try {
		if (!email || !password) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid credentials" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res
				.status(400)
				.json({ success: false, message: "Invalid credentials" });
		}

		console.log(isMatch);

		generateTokenAndSetCookie(res, user._id);
		user.lastLogin = Date.now();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: { ...user._doc, password: "" },
		});
	} catch (error) {
		console.log("Error logging in: ", error);
		return res.status(500).json({ success: false, message: error.message });
	}
};

export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.send({
			success: true,
			users,
		});
	} catch (error) {
		console.log("Error getting users: ", error);
		throw new Error("Error getting users: ", error);
	}
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpireAt = resetTokenExpiresAt;

		await user.save();

		console.log(`${process.env.CLIENT_URL}reset-password/${resetToken}`);
		// send email
		// await sendPasswordResetEmail(
		// 	user.email,
		// 	`${process.env.CLIENT_URL}/reset-password/${resetToken}`
		// );

		return res
			.status(200)
			.json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		return res.status(400).json({ success: false, message: error.message });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpireAt: { $gt: Date.now() },
		});

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "Invalid or expired token" });
		}

		//update password
		const hashedPassword = await bcrypt.hash(password, 10);
		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpireAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email, user.name);
		res
			.status(200)
			.json({ success: true, message: "Password reset successfully" });
	} catch (error) {
		console.log("Error resetting password: ", error);
		throw new Error("Error resetting password: ", error);
	}
};

export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId);
		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}
		res.status(200).json({
			success: true,
			user: { ...user._doc, password: "" },
		});
	} catch (error) {
		console.log("Error checking authentication: ", error);
		throw new Error("Error checking authentication: ", error);
	}
};
