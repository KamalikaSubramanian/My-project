import {
	Box,
	Button,
	Container,
	Heading,
	Input,
	useToast,
	VStack,
	FormControl,
	FormLabel,
	FormErrorMessage,
} from "@chakra-ui/react";
import { useState } from "react";
import { useProductStore } from "../store/product";

const CreatePage = () => {
	const [newProduct, setNewProduct] = useState({
		name: "",
		price: "",
		image: "",
		type: "",
		description: "",
		deliveryTime: "",
	});

	const toast = useToast();
	const [errors, setErrors] = useState({});
	const createProduct = useProductStore((state) => state.createProduct);

	const validateForm = () => {
		const newErrors = {}; 

		if (!newProduct.name.trim()) {
			newErrors.name = "Product name is required";
		}
		if (!newProduct.price.trim()) {
			newErrors.price = "Price is required";
		}
		if (!newProduct.image.trim()) {
			newErrors.image = "Image URL is required";
		}
		if (!newProduct.type.trim()) {
			newErrors.type = "Type is required";
		}
		if (!newProduct.description.trim()) {
			newErrors.description = "Description is required";
		}
		if (!newProduct.deliveryTime.trim()) {
			newErrors.deliveryTime = "Delivery time is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleAddProduct = async (e) => {
		e.preventDefault();

		if (!validateForm())
			return;
		// success and message are the two which is returning in createProduct global variable
		const { success, message } = await createProduct(newProduct);

		if (!success) {
			toast({
				title: "Error",
				description: message,
				status: "error",
				isClosable: true,
			});
		} else {
			toast({
				title: "Success",
				description: message,
				status: "success",
				isClosable: true,
			});
		}

		// ✅ Reset form fields after submission
		setNewProduct({
			name: "",
			price: "",
			image: "",
			type: "",
			description: "",
			deliveryTime: "",
		});
		//setting newProduct empty,after creating the data and gets saved in MongoDB.So that in frontend reactpage it looks empty with no values.
		setErrors({});
	};

	return (
		<Container maxW="container.sm" py={10}>
			<VStack spacing={8}>
				<Heading as="h1" size="xl" textAlign="center" bgGradient={"linear(to-r, cyan.400, blue.500)"} bgClip={"text"} mt={8}>
					Create New Product
				</Heading>

				<Box
					w="full"
					p={6}
					rounded="lg"
					shadow="md"
				>
					<VStack spacing={5}>

						<FormControl isRequired isInvalid={!!errors.name}>
							<FormLabel>Product Name</FormLabel>
							<Input
								placeholder="Enter product name"
								value={newProduct.name}
								onChange={(e) =>
									setNewProduct({ ...newProduct, name: e.target.value })
									// spreading newProduct and get only the name and save the value once Onchange happens in that particular input field.
								}
							/>
							<FormErrorMessage>{errors.name}</FormErrorMessage>
						</FormControl>

						<FormControl isRequired isInvalid={!!errors.price}>
							<FormLabel>Price</FormLabel>
							<Input
								type="number"
								placeholder="Enter price"
								value={newProduct.price}
								onChange={(e) =>
									setNewProduct({ ...newProduct, price: e.target.value })
								}
							/>
							<FormErrorMessage>{errors.price}</FormErrorMessage>
						</FormControl>

						<FormControl isRequired isInvalid={!!errors.image}>
							<FormLabel>Image URL</FormLabel>
							<Input
								placeholder="Enter image URL"
								value={newProduct.image}
								onChange={(e) =>
									setNewProduct({ ...newProduct, image: e.target.value })
								}
							/>
							<FormErrorMessage>{errors.image}</FormErrorMessage>
						</FormControl>

						<FormControl isRequired isInvalid={!!errors.type}>
							<FormLabel>Type</FormLabel>
							<Input
								placeholder="Enter product type"
								value={newProduct.type}
								onChange={(e) =>
									setNewProduct({ ...newProduct, type: e.target.value })
								}
							/>
							<FormErrorMessage>{errors.type}</FormErrorMessage>
						</FormControl>

						<FormControl isRequired isInvalid={!!errors.description}>
							<FormLabel>Description</FormLabel>
							<Input
								placeholder="Enter description"
								value={newProduct.description}
								onChange={(e) =>
									setNewProduct({ ...newProduct, description: e.target.value })
								}
							/>
							<FormErrorMessage>{errors.description}</FormErrorMessage>
						</FormControl>

						<FormControl isRequired isInvalid={!!errors.deliveryTime}>
							<FormLabel>Delivery Time</FormLabel>
							<Input
								placeholder="Enter delivery time"
								value={newProduct.deliveryTime}
								onChange={(e) =>
									setNewProduct({
										...newProduct,
										deliveryTime: e.target.value,
									})
								}
							/>
							<FormErrorMessage>{errors.deliveryTime}</FormErrorMessage>
						</FormControl>

						<Button colorScheme="blue" type="submit" w="full" onClick={handleAddProduct}>
							Add Product
						</Button>
					</VStack>
				</Box>
			</VStack>
		</Container>
	);
};

export default CreatePage;






