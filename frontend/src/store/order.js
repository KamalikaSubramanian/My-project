import { create } from "zustand";
import { API_BASE } from "../config.js";

export const useOrderStore = create((set) => ({
    orders: [],
    loading: false,
    placeOrder: async (userId, products, address, paymentMethod) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_BASE}/api/orders/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId, products, address, paymentMethod }),
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    return { success: false, message: "Unauthorized access" };
                }
                throw new Error(`Error ${res.status}`);
            }

            const data = await res.json();
            if (data.success) {
                set({ orders: data.data });
                return { success: true, message: "Order placed successfully", data: data.data };
            } else {
                return { success: false, message: data.message || "Order placement failed" };
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
            const res = await fetch(`${API_BASE}/api/orders/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    window.location.href = "/unauthorized";
                    return;
                }
                throw new Error(`Error ${res.status}`);
            }
            const data = await res.json();
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