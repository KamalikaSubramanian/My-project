import { create } from "zustand";
import { API_BASE } from "../config.js";
import axios from "axios";
// Zustand is a state management library for React.It lets you store global state (data that multiple components can share) in one place, instead of passing props around everywhere.
// create is the function exported from Zustand used to make a store.You call create() and pass in a function that defines your state and actions.
// set lets you update the state.Inside, you define:state → (products: []) actions → (fetchProducts, deleteProduct, etc.).Because Zustand’s set() expects an OBJECT— the object represents the state updates.
// useProductStore() is a React hook you can call in any component to access the store.
export const useProductStore = create((set) => ({
	products: [],
	selectedProduct: null,
	cartProduct: null,
	setProducts: (products) => set({ products }),
	createProduct: async (newProduct) => {
		if (!newProduct.name || !newProduct.image || !newProduct.price || !newProduct.type || !newProduct.description || !newProduct.deliveryDate) {
			return { success: false, message: "Please fill in all fields." };
		}
		const token = localStorage.getItem("token");
		try {
			const { data } = await axios.post(
				`${API_BASE}/api/products`,
				newProduct,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			set((state) => ({
				products: [...state.products, data.data],
			}));
			// ...state.products Spread syntax → copies all existing items in state.products (your current products array).Example: if state.products = [A, B], then ...state.products = A, B.
			// Take the current state (state).Copy everything from the existing products array (...state.products).Add one new product at the end (data.data).Update the store so products now has the new list.
			return { success: true, message: "Product created successfully" };
		}
		catch (error) {
			if (error.response && (error.response.status === 401 || error.response.status === 403)) {
				window.location.href = "/unauthorized";
				return;
			}
			console.error("Create error:", error);
			return { success: false, message: "Failed to create product" };
		}
	},
	fetchProducts: async () => {
		const token = localStorage.getItem("token");

		try {
			const { data } = await axios.get(`${API_BASE}/api/products`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			set({ products: data.data });
		} catch (err) {
			if (err.response && (err.response.status === 401 || err.response.status === 403)) {
				window.location.href = "/unauthorized";
			}
			console.error("Fetch error:", err);
		}
	},

	deleteProduct: async (pid) => {
		const token = localStorage.getItem("token");
		try {
			const { data } = await axios.delete(
				`${API_BASE}/api/products/${pid}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			// update the ui immediately, without needing a refresh
			set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));
			return { success: true, message: data.message };
		}
		catch (err) {
			console.error("Delete error:", err);
			if (err.response && (err.response.status === 401 || err.response.status === 403)) {
				window.location.href = "/unauthorized";
				return;
			}
			return { success: false, message: "Failed to delete product" };
		}
	},
	updateProduct: async (pid, updatedProduct) => {
		const token = localStorage.getItem("token");
		try {
			const { data } = await axios.put(
				`${API_BASE}/api/products/${pid}`,
				updatedProduct,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			// update the ui immediately, without needing a refresh
			set((state) => ({
				products: state.products.map((product) => (product._id === pid ? data.data : product)),
			}));

			return { success: true, message: data.message };
		}
		catch (err) {
			if (err.response && (err.response.status === 401 || err.response.status === 403)) {
				window.location.href = "/unauthorized";
				return;
			}
			console.error("Update error:", err);
			return { success: false, message: "Failed to update product" };
		}
	},
	fetchProductById: async (id) => {
		const token = localStorage.getItem("token");
		try {
			const { data } = await axios.get(
            `${API_BASE}/api/products/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
			set({ selectedProduct: data.data });
			return data.data;
		}
		catch (err) {
			if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            window.location.href = "/unauthorized";
            return;
        }
			console.error("Error fetching product:", err);
		}
	}
}));

// axios.put(url, body, config)
// URL = where to send
// Body = what to send
// Config = extra settings like headers