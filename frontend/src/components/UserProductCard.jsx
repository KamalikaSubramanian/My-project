import { Box, Image, Heading, HStack, Button, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const UserProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <Box p={4} shadow="md" rounded="lg" bg="white">
      <Image
        src={product.image}
        alt={product.name}
        h={48}
        w="full"
        objectFit="cover"
        cursor="pointer"
        onClick={() => navigate(`/user/product/${product._id}`)}
      />

      <Heading
        size="md"
        mt={2}
        cursor="pointer"
        onClick={() => navigate(`/user/product/${product._id}`)}
      >
        {product.name}
      </Heading>

      <Text color="blue.600" fontWeight="bold">
        ₹{product.price}
      </Text>
    </Box>
  );
};

export default UserProductCard;


