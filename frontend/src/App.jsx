import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/HomePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

import UserProductPage from "./pages/UserProductPage.jsx";
import AdminProductPage from "./pages/AdminProductPage.jsx";
import CreatePage from "./pages/CreatePage.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import UnauthorizedPage from "./pages/UnauthorizedPage.jsx";
import AdminProductDetailPage from "./pages/AdminProductDetailPage.jsx";
import UserProductDetailPage from "./pages/UserProductDetailPage.jsx";

import BuyNowPage from "./pages/BuyNowPage.jsx";
import OrderPage from "./pages/OrderPage.jsx";
import AddToCartPage from "./pages/AddToCartPage.jsx";
import MyOrdersListPage from "./pages/MyOrdersListPage.jsx";


function App() {
	return (
		<Box minH={"100vh"}
			bgImage="url('https://images.unsplash.com/photo-1487147264018-f937fba0c817?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFja2dyb3VuZCUyMGRlc2lnbnxlbnwwfHwwfHx8MA%3D%3D')"
			bgSize="cover"
			bgPosition="center"
			bgRepeat="no-repeat"
			bgAttachment="fixed"
		>
			<Navbar />
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/register' element={<RegisterPage />} />
				<Route path='/login' element={<LoginPage />} />

				<Route
					path='/admin/product'
					element={
						<ProtectedRoute allowedRoles={["admin"]}>
							<AdminProductPage />
							{/* children */}
						</ProtectedRoute>
					}
				/>
				<Route
					path='/admin/product/:id'
					element={
						<ProtectedRoute allowedRoles={["admin"]}>
							<AdminProductDetailPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/user/product'
					element=
					{
						<ProtectedRoute allowedRoles={["user"]}>
							<UserProductPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/user/product/:id'
					element={
						<ProtectedRoute allowedRoles={["user"]}>
							<UserProductDetailPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/create'
					element=
					{
						<ProtectedRoute allowedRoles={["admin"]}>
							<CreatePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/addToCart'
					element={
						<ProtectedRoute allowedRoles={["user"]}>
							<AddToCartPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/buyNow'
					element={
						<ProtectedRoute allowedRoles={["user"]}>
							< BuyNowPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/order'
					element={
						<ProtectedRoute allowedRoles={["user"]}>
							<OrderPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/myOrderList'
					element={
						<ProtectedRoute allowedRoles={["user"]}>
							<MyOrdersListPage />
						</ProtectedRoute>
					}
				/>
				<Route path="/unauthorized" element={<UnauthorizedPage />} />
			</Routes>
		</Box>
	);
}

export default App;
// <Routes> is a wrapper component that holds all your <Route> components.
// <Route> — A single URL - Each <Route> defines:✔ The URL path ✔ The component to render