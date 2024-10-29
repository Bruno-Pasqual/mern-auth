import { HomeIcon, LogOut } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const Home = () => {
	const { logout } = useAuthStore();

	const handleLogout = () => {
		logout();
	};

	return (
		<div className="flex items-center justify-center h-screen">
			<HomeIcon color="white" size={64} />

			<LogOut onClick={handleLogout} color="white" size={64} />
		</div>
	);
};

export default Home;
