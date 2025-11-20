import { create } from "zustand";
import { API_BASE } from "../config.js";
import axios from "axios";
export const useOrderStore = create((set) => ({
    orders: [],
    loading: false,
    placeOrder: async (userId, products, address, paymentMethod) => {
        const token = localStorage.getItem("token");
        try {
            const { data } = await axios.post(
                `${API_BASE}/api/orders/`,
                { userId, products, address, paymentMethod },   
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (data.success) {
                set({ orders: data.data });
                return { success: true, message: "Order placed successfully", data: data.data };
            }
        }
        catch (err) {
            console.error("Error placing order:", err);
            return { success: false, message: "Error in placing the order" };
        }
    },
    fetchOrderByUser: async (userId) => {
        set({ loading: true })
        const token = localStorage.getItem("token");
        try {
            const { data } = await axios.get(
                `${API_BASE}/api/orders/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            set({ orders: data.data || [], loading: false })
            return { success: true, message: "Order fetched successfully" }
        }
        catch (err) {
            console.error("Error fetching orders:", err);
            set({ loading: false });
            return { success: true, message: "Error in fetching orders" };

        }
    }
}))