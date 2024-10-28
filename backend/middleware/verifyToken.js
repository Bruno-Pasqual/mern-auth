import jwt from "jsonwebtoken";

//Here in this function we are verifying the token that is present in the cookie
//If the token is not present then it will return an error

export const verifyToken = async (req, res, next) => {
	const token = req.cookies.mernToken;

	if (!token) {
		return res.status(401).json({ message: "Unauthorized - no token provided" });
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET);

	if (!decoded) {
		return res.status(401).json({ message: "Unauthorized - invalid token" });
	}

	req.userId = decoded.userId;
	next();

	try {
	} catch (error) {
		console.log("Error verifying token: ", error);
		throw new Error("Error verifying token: ", error);
	}
};
