import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "1d",
	});
	res.cookie("mernToken", token, {
		httpOnly: true, //Cannot be accessed from frontend
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 24 * 60 * 60 * 1000,
	});

	return token;
};
