import { create } from "zustand";
import { API_BASE } from "../config.js";

// Zustand is a state management library for React.It lets you store global state (data that multiple components can share) in one place, instead of passing props around everywhere.
// create is the function exported from Zustand used to make a store.You call create() and pass in a function that defines your state and actions.
// set lets you update the state.Inside, you define:state → (products: []) actions → (fetchProducts, deleteProduct, etc.).Because Zustand’s set() expects an OBJECT— the object represents the state updates.
// useProductStore() is a React hook you can call in any component to access the store.
export const useProductStore = create((set) => ({
	products: [],
	selectedProduct :null,
	cartProduct:null,
	setProducts: (products) => set({ products }),
	createProduct: async (newProduct) => {
		if (!newProduct.name || !newProduct.image || !newProduct.price || !newProduct.type|| !newProduct.description || !newProduct.deliveryDate) {
			return { success: false, message: "Please fill in all fields." };
		}
		const token = localStorage.getItem("token");
		try {
			const res = await fetch(`${API_BASE}/api/products`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					// headers are the extra information send with the request.
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(newProduct),
				// http only reads text not json so we use stingify
			});
			if (!res.ok) {
				if (res.status === 401 || res.status === 403) {
					window.location.href = "/unauthorized";
					return;
				}
				throw new Error(`Error ${res.status}`);
			}
			const data = await res.json();
			set((state) => ({ products: [...state.products, data.data] }));
			// ...state.products Spread syntax → copies all existing items in state.products (your current products array).Example: if state.products = [A, B], then ...state.products = A, B.
			// Take the current state (state).Copy everything from the existing products array (...state.products).Add one new product at the end (data.data).Update the store so products now has the new list.
			return { success: true, message: "Product created successfully" };
		}
		catch (error) {
			console.error("Create error:", error);
			return { success: false, message: "Failed to create product" };
		}

	},
	fetchProducts: async () => {
		const token = localStorage.getItem("token");

		try {
			const res = await fetch(`${API_BASE}/api/products`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!res.ok) {
				if (res.status === 401 || res.status === 403) {
					window.location.href = "/unauthorized";
					return;
				}
				throw new Error(`Error ${res.status}`);
			}
			const data = await res.json();
			set({ products: data.data });
		} catch (err) {
			console.error("Fetch error:", err);
		}
	},

	deleteProduct: async (pid) => {
		const token = localStorage.getItem("token");
		try {
			const res = await fetch(`${API_BASE}/api/products/${pid}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			if (!res.ok) {
				if (res.status === 401 || res.status === 403) {
					window.location.href = "/unauthorized";
					return;
				}
				throw new Error(`Error ${res.status}`);
			}
			const data = await res.json();
			if (!data.success) return { success: false, message: data.message };

			// update the ui immediately, without needing a refresh
			set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));
			return { success: true, message: data.message };
		}
		catch (err) {
			console.error("Delete error:", err);
			return { success: false, message: "Failed to delete product" };
		}
	},
	updateProduct: async (pid, updatedProduct) => {
		const token = localStorage.getItem("token");
		try {
			const res = await fetch(`${API_BASE}/api/products/${pid}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(updatedProduct),
			});
			if (!res.ok) {
				if (res.status === 401 || res.status === 403) {
					window.location.href = "/unauthorized";
					return;
				}
				throw new Error(`Error ${res.status}`);
			}
			const data = await res.json();
			if (!data.success) return { success: false, message: data.message };

			// update the ui immediately, without needing a refresh
			set((state) => ({
				products: state.products.map((product) => (product._id === pid ? data.data : product)),
			}));

			return { success: true, message: data.message };
		}
		catch (err) {
			console.error("Update error:", err);
			return { success: false, message: "Failed to update product" };
		}
	},
	fetchProductById: async (id) => {
		const token = localStorage.getItem("token");
		try {
			const res = await fetch(`${API_BASE}/api/products/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			if (!res.ok) {
				if (res.status === 401 || res.status === 403) {
					window.location.href = "/unauthorized";
					// window.location refers to the current URL in the browser.window.location.href is the full address (link) currently shown in the browser bar.
					return;
				}
				throw new Error(`Error ${res.status}`);
			}
			const data = await res.json();
			set({ selectedProduct: data.data });
			return data.data
		}
		catch (err) {
			console.error("Error fetching product:", err);
		}
	} 
}));