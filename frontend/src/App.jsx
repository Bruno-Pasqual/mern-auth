/* eslint-disable react/prop-types */
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";

import FloatingShape from "./components/FloatingShape";
import Signup from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import Home from "./pages/Home";
import { useEffect } from "react";

function App() {
	const { isAuthenticated, user, checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	//Redirect authenticated users to home page

	const RedirectAuthenticatedUser = ({ children }) => {
		if (isAuthenticated && user.isVerified) {
			return <Navigate to="/" />;
		}
		return children;
	};

	//Protect routes that require authentication

	const ProtectedRoute = ({ children }) => {
		const { isAuthenticated } = useAuthStore();
		if (!isAuthenticated) {
			return <Navigate to="/login" />;
		}

		if (!user.isVerified) {
			return <Navigate to="/verify-email" />;
		}

		return children;
	};

	return (
		<div className="min-h-screen bg-gradient-to-r from-gray-900 via-green-900 to-emerald-900 items-center justify-center relative overflow-hidden ">
			<FloatingShape
				color="bg-green-500"
				size="w-64 h-64"
				top="-5%"
				left="10%"
				delay={0}
			/>
			<FloatingShape
				color="bg-emerald-500"
				size="w-64 h-64"
				top="70%"
				left="80%"
				delay={5}
			/>
			<FloatingShape
				color="bg-lime-500"
				size="w-64 h-64"
				top="40%"
				left="-10%"
				delay={2}
			/>

			<Routes>
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Home />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/signup"
					element={
						<RedirectAuthenticatedUser>
							<Signup />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route
					path="/login"
					element={
						<RedirectAuthenticatedUser>
							<LoginPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route path="/verify-email" element={<EmailVerificationPage />} />
			</Routes>
			<Toaster />
		</div>
	);
}

export default App;
