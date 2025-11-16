import React, { useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Divider,
  Image,
  Button,
  useToast,
} from "@chakra-ui/react";
import { FaShoppingCart } from "react-icons/fa";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import { useProductStore } from "../store/product.js";
import { useCartStore } from "../store/cart.js";

const UserProductDetailPage = () => {
  const { id } = useParams();

  const selectedProduct = useProductStore((state)=>state.selectedProduct);
  const fetchProductById = useProductStore((state)=>state.fetchProductById);
  const addToCart= useProductStore((state)=>state.addToCart);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const toast = useToast();

  useEffect(() => {
    fetchProductById(id);
  }, [id, fetchProductById]);

  if (!selectedProduct) {
    return (
      <Box
        h="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="2xl"
        color="gray.500"
      >
        Loading product details...
      </Box>
    );
  }

  const handleAddToCart = async () => {
    if (!userId)
      return toast({
        title: "Login Required",
        description: "Please log in first.",
        status: "warning",
      });

    const { success, message } = await addToCart(userId, selectedProduct._id);

    if (success) {
      toast({
        title: "Success",
        description: message || "Product added to cart!",
        status: "success",
        isClosable: true,
      });
      if (role === "user") navigate("/addToCart");
    } else {
      toast({
        title: "Error",
        description: message || "Failed to add product to cart",
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgImage="url('https://images.unsplash.com/photo-1487147264018-f937fba0c817?w=1200&auto=format&fit=crop&q=60')"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      bgAttachment="fixed"
      py={10}
      px={4}
    >
      <Container
        maxW="container.lg"
        p={8}
        bgColor="orange.100"
        borderRadius="2xl"
        boxShadow="xl"
      >
        <HStack
          spacing={10}
          flexDirection={{ base: "column", md: "row" }}
          alignItems="center"
          justifyContent="center"
        >
          {/* Product Image */}
          <Box flex="1" textAlign="center">
            <Image
              src={selectedProduct.image}
              alt={selectedProduct.name}
              borderRadius="xl"
              w={{ base: "250px", md: "350px" }}
              h={{ base: "250px", md: "350px" }}
              objectFit="cover"
              boxShadow="lg"
              mx="auto"
            />
          </Box>

          {/* Product Info */}
          <VStack flex="1" align="flex-start" spacing={4}>
            <Text fontSize="3xl" fontWeight="bold" color="blue.700">
              {selectedProduct.name}
            </Text>
            <Text fontSize="xl" color="gray.800">
              <b>Type:</b> {selectedProduct.type}
            </Text>
            <Text fontSize="lg" color="gray.800">
              <b>Description:</b> {selectedProduct.description}
            </Text>
            <Divider />
            <Text fontSize="xl" fontWeight="semibold" color="green.800">
              <b>Price:</b> ₹{selectedProduct.price}
            </Text>
            <Text fontSize="md" color="red.600">
              <b>Estimated Delivery:</b>{" "}
              {selectedProduct.deliveryTime || "3-5 days"}
            </Text>

            <HStack spacing={6} mt={4}>
              <Button
                colorScheme="teal"
                leftIcon={<FaShoppingCart />}
                size="lg"
                px={8}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button
                colorScheme="blue"
                leftIcon={<RiMoneyRupeeCircleFill />}
                size="lg"
                px={8}
                onClick={() =>
                  navigate("/buyNow", { state: { product: selectedProduct } })
                }
              >
                Buy Now
              </Button>
            </HStack>
          </VStack>
        </HStack>
      </Container>
    </Box>
  );
};

export default UserProductDetailPage;

