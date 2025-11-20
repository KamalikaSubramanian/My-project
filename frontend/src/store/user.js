import { create } from 'zustand';
import { API_BASE } from "../config.js";
import axios from 'axios';

export const useUserStore = create((set) => ({
    user: null,
    token: null,
    error: null,

    registerUser: async (newUser) => {
        try {
            if (!newUser.username || !newUser.password || !newUser.role) {
                return { success: false, message: "Please provide all the fields" };
            }
            const { data } = await axios.post(
                `${API_BASE}/api/auth/register`,
                newUser,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                }
            )
            if (!data.success) {
                return { success: false, message: data.message };
            }
            return { success: true, message: "User registered successfully" };
        }
        catch (err) {
            set({ error: err.message });
            return { success: false, mesage: err.message }
        }
    },
    loginUser: async (Credentials) => {
        try {
            const { data } = await axios.post(
                `${API_BASE}/api/auth/login`,
                Credentials,
                { headers: { "Content-Type": "application/json" } }
            );

            if (!data.success) {
                return { success: false, message: data.message };
            }

            set({
                user: data.user,
                token: data.token,
                error: null
            });
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("userId", data.user._id);

            return { success: true, message: "Logged successfully", role: data.user.role, userId: data.user._id }
        }
        catch (err) {
            set({ error: err.message });
            return ({ success: false, message: err.message })
        }
    },
    logOutUser: async () => {
        localStorage.removeItem("token")
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        set({ user: null, token: null, error: null })
    }
}))