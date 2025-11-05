import {
  SimpleGrid,
  Container,
  VStack,
  Select,
  Text,
  Box,
  HStack,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { useProductStore } from "../store/product.js";
import UserProductCard from "../components/UserProductCard.jsx";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaClipboardList } from "react-icons/fa";
import { RiShoppingBagFill } from "react-icons/ri";

const UserProductPage = () => {
  const [selectedType, setSelectedType] = useState("All");
  const { fetchProducts, products } = useProductStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts =
    selectedType === "All"
      ? products
      : products.filter((p) => p.type === selectedType);

  if (!products || products.length === 0) {
    return (
      <Box
        h="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="2xl"
        color="gray.500"
      >
        No products found 😢
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      < VStack spacing={8}>
        <HStack
          w="full"
          justify="space-between"
          align="center"
          px={4}
          mt={8}
        >
          <Text fontSize="2xl" fontWeight="bold" color="teal.600">
            Available Products
          </Text>

          <HStack spacing={4}>
            <Tooltip label="Go to Cart" hasArrow>
              <IconButton
                icon={<FaShoppingCart />}
                aria-label="Cart"
                colorScheme="teal"
                variant="outline"
                onClick={() => navigate("/addToCart")}
                _hover={{ bg: "teal.500", color: "white", transform: "scale(1.1)" }}
                transition="all 0.2s ease-in-out"
              />
            </Tooltip>

            <Tooltip label="To Order" hasArrow>
              <IconButton
                icon={<FaClipboardList />}
                aria-label="To Order"
                colorScheme="teal"
                variant="outline"
                onClick={() => navigate("/order")}
                _hover={{ bg: "teal.500", color: "white", transform: "scale(1.1)" }}
                transition="all 0.2s ease-in-out"
              />
            </Tooltip>

             <Tooltip label="My Orders List" hasArrow>
              <IconButton
                icon={<RiShoppingBagFill />}
                aria-label="My Orders List"
                colorScheme="teal"
                variant="outline"
                onClick={() => navigate("/myOrderList")}
                _hover={{ bg: "teal.500", color: "white", transform: "scale(1.1)" }}
                transition="all 0.2s ease-in-out"
              />
            </Tooltip>
          </HStack>
        </HStack>

        <Select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          width="300px"
          bg="white"
          borderColor="teal.400"
          _hover={{ borderColor: "teal.500", boxShadow: "0 0 8px teal" }}
          _focus={{ borderColor: "teal.600", boxShadow: "0 0 8px teal" }}
        >
          <option value="All">All</option>
          <option value="Gadgets">Gadgets</option>
          <option value="Dresses">Dresses</option>
          <option value="Home appliances">Home appliances</option>
          <option value="Sports material">Sports material</option>
        </Select>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10}>
          {filteredProducts.map((product) => (
            <UserProductCard key={product._id} product={product} />
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default UserProductPage;


