import { Container, SimpleGrid, Text, VStack, Button, HStack, Select } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { useProductStore } from "../store/product";
import ProductCard from "../components/ProductCard";

const AdminProductPage = () => {
	const { fetchProducts, products } = useProductStore();
	const [selectedType, setselectedType] = useState("All");

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const filteredProducts = selectedType === "All" ? products : products.filter((p) => p.type === selectedType)
	console.log("Filtered Products:", filteredProducts)

	const navigate = useNavigate();
	return (
		<Container maxW='container.xl' py={12} >
			<VStack spacing={8}>
				<Text
					fontSize={"30"}
					fontWeight={"bold"}
					bgGradient={"linear(to-r, cyan.400, blue.500)"}
					bgClip={"text"}
					textAlign={"center"}
					marginTop={"20px"}
				>
					Current Products 🚀
				</Text>
				<HStack>
					<Select
						value={selectedType}
						onChange={(e) => setselectedType(e.target.value)}
						width="300px"
						bg="white"
						margin={"20px"}
					>
						<option value="All">All</option>
						<option value="Gadgets">Gadgets</option>
						<option value="Dresses">Dresses</option>
						<option value="Home appliances">Home appliances</option>
						<option value="Sports material">Sports material</option>
					</Select>
					<Link to={"/create"}>
						<Button leftIcon={<PlusSquareIcon />}>Create Products</Button>
					</Link>
				</HStack>

				<SimpleGrid
					columns={{
						base: 1,
						md: 2,
						lg: 3,
					}}
					spacing={10}
				>
					{filteredProducts.map((product) => (
						<ProductCard key={product._id} product={product} />
						// saving product(data) inside the prop product.
					))}
				</SimpleGrid>

				{products.length === 0 && (
					<Text fontSize='xl' textAlign={"center"} fontWeight='bold' color='gray.500'>
						No products found 😢{" "}
						<Link to={"/create"}>
							<Text as='span' color='blue.500' _hover={{ textDecoration: "underline" }}>
								Create a product
							</Text>
						</Link>
					</Text>
				)}
			</VStack>
		</Container>
	);
};
export default AdminProductPage;