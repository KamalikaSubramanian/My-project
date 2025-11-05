import { create } from "zustand";

export const useCartStore = create((set) => ({
  cart: null,
  loading: false,

  addToCart: async (userId, productId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/carts/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, productId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to add product");

      set({ cart: data.data });
      return { success: true, message: data.message || "Product added to cart" };
    } catch (err) {
      console.error("Error adding to cart:", err);
      return { success: false, message: err.message || "Error adding to cart" };
    }
  },

  fetchCart: async (userId) => {
    const token = localStorage.getItem("token");
    set({ loading: true });
    try {
      const res = await fetch(`/api/carts/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        set({ cart: data.data, loading: false });
        return { success: true, message: "Product fetched successfully" };
      } else {
        set({ loading: false });
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      set({ loading: false });
      return { success: false, message: "Product not fetched" };
    }
  },

  updateQuantity: async (userId, productId, action) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/carts/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, productId, action }),
      });

      const data = await res.json();
       if (!res.ok) throw new Error(data.message || "Failed to update quantity");
      if (data.success) {
        set({ cart: data.data });
        return { success: true, message: data.message || "Quantity updated." };
      }
      return { success: false, message: data.message || "Failed to update quantity." };
    }
    catch (err) {
      console.error("Error updating quantity:", err);
      return { success: false, message: "Quantity not updated" };
    }
  },

  removeItem: async (userId, productId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/carts/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, productId }),
      });

      const data = await res.json();

       if (!res.ok) throw new Error(data.message || "Failed to remove product");
      if (data.success) {
        set({ cart: data.data });
        return { success: true, message: data.message || "Product removed from cart" };
      }

      return { success: false, message: data.message || "Failed to remove product." };
    }
    catch (err) {
      console.error("Error removing product:", err);
      return { success: false, message: "Product not removed from cart" };
    }
  },

}));
