import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";
axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	isLoading: false,
	isCheckingAuth: true,

	deleteUser: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axios.delete(`${API_URL}/delete-user/${id}`);
			set({ user: null, isAuthenticated: false, isLoading: false });
		} catch (error) {
			set({
				error: error.response.data.message || "Error deleting user",
				isLoading: false,
			});
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/logout`);
			set({
				user: null,
				isAuthenticated: false,
				isLoading: false,
			});
			return response;
		} catch (error) {
			set({
				error: error.response.data.message || "Error in logging out",
				isLoading: false,
			});
			throw new Error(error.response.data.message || "Error in logging out");
		}
	},

	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/login`, {
				email,
				password,
			});

			console.log(response != undefined);

			set({
				user: response.data.user,
				isAuthenticated: true,
				error: null,
				isLoading: false,
			});
		} catch (error) {
			set({
				error: error.response.data.message || "Error signing up",
				isLoading: false,
			});
		}
	},

	signup: async (email, password, name) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/signup`, {
				email,
				password,
				name,
			});
			set({
				user: response.data.user,
				isAuthenticated: true,
				isLoading: false,
			});
		} catch (error) {
			set({
				error: error.response.data.message || "Error signing up",
				isLoading: false,
			});
			throw new Error(error.response.data.message || "Error signing up");
		}
	},

	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verify-email`, {
				code,
			});

			console.log(response);
			set({
				user: response.data.user,
				isAuthenticated: true,
				isLoading: false,
			});
			return response.data;
		} catch (error) {
			set({
				error: error.response.data.message || "Error verifying email",
				isLoading: false,
			});
			throw new Error(error.response.data.message || "Error verifying email");
		}
	},

	checkAuth: async () => {
		set({ error: null, isCheckingAuth: true });
		try {
			const response = await axios.get(`${API_URL}/check-auth`);

			set({
				user: response.data.user,
				isAuthenticated: true,
				isCheckingAuth: false,
			});
		} catch (error) {
			set({
				error: null,
				isCheckingAuth: false,
				isAuthenticated: false,
			});
			// throw new Error(error.response.data.message || "Error checking auth");
		}
	},

	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error:
					error.response?.data?.message || "Error sending reset password email",
			});
		}
	},

	resetPassword: async (code, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password`, {
				code,
				password,
			});
			set({ isLoading: false, error: null, message: response.data.message });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw new Error(error.response.data.message || "Error resetting password");
		}
	},
}));
