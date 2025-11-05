import React, { useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Divider,
  HStack,
  Button,
  Image,
  Card,
  CardBody,
  useToast,
} from "@chakra-ui/react";
import { useCartStore } from "../store/cart.js";
import { useNavigate } from "react-router-dom";

const AddToCartPage = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const toast = useToast();

  const { cart, fetchCart, loading, updateQuantity, removeItem } = useCartStore();

  useEffect(() => {
    if (userId) fetchCart(userId);
  }, [userId, fetchCart]);

  const handleQuantityChange = async (productId, action) => {
    const { success, message } = await updateQuantity(userId, productId, action)
    if (success) {
      toast({
        title: `Quantity ${action === "increase" ? "increased" : "decreased"}`,
        description: message,
        status: "success",
        duration: 1500,
        isClosable: true,
      })

    }
    else {
      toast({
        title: "Error updating quantity",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const handleRemove = async (productId) => {
    const { success, message } = await removeItem(userId, productId);

    if (success) {
      toast({
        title: "Product removed from cart",
        description: message,
        status: "info",
        duration: 2000,
        isClosable: true,
      })
    }
    else {
      toast({
        title: "Error removing product",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }
  if (loading || !cart) {
    return <Text p={6}>Loading your cart...</Text>;
  }

  return (
    <Box p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Your Cart
      </Text>
      <Divider mb={4} />

      <VStack align="stretch" spacing={4} >
        {cart.products.length === 0 ? (
          <Text><b>Your cart is empty.</b></Text>
        ) : (
          cart.products.map((p, i) => {
            const product = p.product || p.productId || {};

            return (
              <Card
                key={product._id || i}
                borderWidth="1px"
                borderRadius="xl"
                boxShadow="md"
                _hover={{ boxShadow: "lg", transform: "scale(1.01)" }}
                transition="0.2s ease"
                overflow="hidden"
              >
                <HStack spacing={4}>
                  <Box
                    w="150px"
                    h="150px"
                    flexShrink={0}
                    bg="gray.100"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    m={"2"}
                  >
                    <Image
                      src={
                        product.image ||
                        "https://via.placeholder.com/150?text=No+Image"
                      }
                      alt={product.name || "Product Image"}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      borderRadius="md"

                    />
                  </Box>

                  <CardBody>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xl" fontWeight="bold">
                        {product.name || "Unnamed Product"}
                      </Text>
                      <Text color="gray.900">
                        {product.description || "No description available."}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Type: {product.type || "N/A"}
                      </Text>
                      <HStack>
                        <Button
                          size={"sm"}
                          onClick={() => handleQuantityChange(product._id, "decrease")}>
                          -
                        </Button>
                        <Text>{p.quantity}</Text>
                        <Button
                          size={"sm"}
                          onClick={() => handleQuantityChange(product._id, "increase")}>
                          +
                        </Button>
                      </HStack>

                      <HStack justify="space-between" w="100%" pt={2}>
                        <Text fontWeight="semibold" fontSize="lg">
                          Price: ₹{product.price || 0}
                        </Text>
                        {product.deliveryTime && (
                          <Text color="green.700">
                            <b>Delivery:</b> {product.deliveryTime}
                          </Text>
                        )}
                      </HStack>

                      <Button
                        size={"sm"}
                        colorScheme="red"
                        variant={"outline"}
                        mt={2}
                        onClick={() => handleRemove(product._id)}
                      >
                        Remove from cart
                      </Button>
                    </VStack>
                  </CardBody>
                </HStack>
              </Card>
            );
          })
        )}
      </VStack>

      {cart.products.length > 0 && (
        <>
          <Divider my={4} />
          <HStack justify="space-between">
            <Text fontSize="xl" fontWeight="bold">
              Total: ₹{cart.totalAmount}
            </Text>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => navigate("/order")}
            >
              Place Order
            </Button>
          </HStack>
        </>
      )}
    </Box>
  );
};

export default AddToCartPage;
