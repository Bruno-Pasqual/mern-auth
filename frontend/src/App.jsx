import { Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import Signup from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

function App() {
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
				<Route path="/" element={"Home"} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/login" element={<LoginPage />} />
			</Routes>
		</div>
	);
}

export default App;
