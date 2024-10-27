import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplates.js";
import { mailTrapClient, sender } from "../mailtrap/mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationCode) => {
	// const recipient = [{ email }];

	// try {
	// 	const response = await mailTrapClient.send({
	// 		from: sender,
	// 		to: recipient,
	// 		subject: "Verify Your Email",
	// 		html: VERIFICATION_EMAIL_TEMPLATE.replace(
	// 			"{verificationCode}",
	// 			verificationCode
	// 		),
	// 		category: "email-verification",
	// 	});

	// 	console.log("Email sent: ", response);
	// } catch (error) {
	// 	console.log(`Error sending verification email: ${error}`);
	// 	throw new Error(`Error sending verification email: ${error}`);
	// }
	console.log("Verification Email sent");
};

export const sendWelcomeEmail = async (email, name) => {
	console.log("Welcome Email sent");
	// const recipient = [{ email }];
	// try {
	// 	const response = await mailTrapClient.send({
	// 		from: sender,
	// 		to: recipient,
	// 		subject: "Welcome to our app - " + name,
	// 		html: `<h1>Welcome to our app</h1>`,
	// 		category: "welcome",
	// 	});
	// 	console.log("Email sent: ", response);
	// } catch (error) {
	// 	console.log(`Error sending welcome email: ${error}`);
	// 	throw new Error(`Error sending welcome email: ${error}`);
	// }
};

export const sendPasswordResetEmail = async (email, resetUrl) => {
	const recipient = [{ email }];
	console.log(resetUrl);

	try {
		const response = await mailTrapClient.send({
			from: sender,
			to: recipient,
			subject: "Password Reset",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
			category: "password-reset",
		});
		console.log("Email sent: ", response);
	} catch (error) {
		console.log(`Error sending password reset email: ${error}`);
		throw new Error(`Error sending password reset email: ${error}`);
	}
};

export const sendResetSuccessEmail = async (email) => {
	const recipient = [{ email }];

	try {
		const response = await mailTrapClient.send({
			from: sender,
			to: recipient,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "password-reset-success",
		});
		console.log("Email sent: ", response);
	} catch (error) {
		console.log(`Error sending password reset success email: ${error}`);
		throw new Error(`Error sending password reset success email: ${error}`);
	}
};
