import { create } from "zustand";
import { API_BASE } from "../config.js";
import axios from "axios";

export const useCartStore = create((set) => ({
  cart: null,
  loading: false,

  addToCart: async (userId, productId) => {
    const token = localStorage.getItem("token");

    try {
      const { data } = await axios.post(
        `${API_BASE}/api/carts/`,
        { userId, productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({ cart: data.data });
      return { success: true, message: data.message || "Product added to cart" };
    }

    catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        window.location.href = "/unauthorized";
        return;
      }
      console.error("Error adding to cart:", err);
      return { success: false, message: err.message || "Error adding to cart" };
    }
  },

  fetchCart: async (userId) => {
    const token = localStorage.getItem("token");
    set({ loading: true });

    try {
      const { data } = await axios.get(`${API_BASE}/api/carts/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ cart: data.data, loading: false });
      return { success: true, message: "Cart fetched successfully" };
    }

    catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        window.location.href = "/unauthorized";
        return;
      }

      console.error("Error fetching cart:", err);
      set({ loading: false });
      return { success: false, message: "Cart not fetched" };
    }
  },

  updateQuantity: async (userId, productId, action) => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.patch(
        `${API_BASE}/api/carts/`,
        { userId, productId, action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({ cart: data.data });
      return { success: true, message: data.message || "Quantity updated." };

    }
    catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        window.location.href = "/unauthorized";
        return;
      }
      console.error("Error updating quantity:", err);
      return { success: false, message: "Quantity not updated" };
    }
  },

  removeItem: async (userId, productId) => {
    const token = localStorage.getItem("token");
    try {
        const { data } = await axios.delete(`${API_BASE}/api/carts/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { userId, productId }, // axios DELETE uses "data"
      });
        set({ cart: data.data });
        return { success: true, message: data.message || "Product removed from cart" };
    }
    catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        window.location.href = "/unauthorized";
        return;
      }
      console.error("Error removing product:", err);
      return { success: false, message: "Product not removed from cart" };
    }
  },

}));
