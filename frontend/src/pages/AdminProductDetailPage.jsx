import React, { useEffect } from 'react';
import {
  Box,
  Button,
  HStack,
  VStack,
  Container,
  Divider,
  Image,
  Text,
} from "@chakra-ui/react";
import { useProductStore } from '../store/product.js';
import { useNavigate, useParams } from 'react-router-dom';

const AdminProductDetailPage = () => {
  const { id } = useParams();
  const { selectedProduct, fetchProductById } = useProductStore();
  const navigate = useNavigate();

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
        Loading Product details...
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="orange.50"
      py={10}
      px={4}
      bgImage="url('https://images.unsplash.com/photo-1487147264018-f937fba0c817?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFja2dyb3VuZCUyMGRlc2lnbnxlbnwwfHwwfHx8MA%3D%3D')"
			bgSize="cover"
			bgPosition="center"
			bgRepeat="no-repeat"
			bgAttachment="fixed"
    >
      <Container
        maxW="container.lg"
        p={8}
        bgColor="orange.100"
        borderRadius="2xl"
        boxShadow="xl"
        overflow="hidden"
      >
        <HStack
          spacing={10}
          flexDirection={{ base: "column", md: "row" }}
          alignItems="center"
          justifyContent="center"
        >

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
          </VStack>
        </HStack>
      </Container>
    </Box>
  );
};

export default AdminProductDetailPage;

