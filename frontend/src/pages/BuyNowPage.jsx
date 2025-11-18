import React, { useState } from "react";
import {
  Box,
  VStack,
  Text,
  Image,
  HStack,
  Button,
  Divider,
  Input,
  Select,
  useToast,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useOrderStore } from "../store/order.js";

const BuyNowPage = () => {
  const { state } = useLocation();
  const selectedProduct = state?.product;
  const userId = localStorage.getItem("userId");
  const toast = useToast();
  const navigate = useNavigate();
  const placeOrder = useOrderStore((state) => state.placeOrder);

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const deliveryTime = "Expected delivery within 4–6 business days.";


  const validateForm = () => {
    let newErrors = {};

    if (!address.name.trim()) newErrors.name = "Full Name is required";
    if (!address.street.trim()) newErrors.street = "Street address is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.state.trim()) newErrors.state = "State is required";
    if (!address.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (address.pincode.length !== 6) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    if (!address.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (address.phone.length !== 10) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast({
        title: "User not logged in",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (!selectedProduct) {
      toast({
        title: "No product selected",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (!validateForm())
      return;

    const orderProducts = [
      {
        productId: selectedProduct._id,
        name: selectedProduct.name,
        description: selectedProduct.description,
        type: selectedProduct.type,
        price: selectedProduct.price,
        quantity: 1,
        image: selectedProduct.image,
        deliveryTime,
      },
    ];

    setLoading(true);
    const result = await placeOrder(userId, orderProducts, address, paymentMethod);
    setLoading(false);

    if (result.success) {
      setOrderPlaced(true);
      setAddress({
        name: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
      });
      setTimeout(() => {
        setOrderPlaced(false);
        navigate("/myOrderList");
      }, 2000);
    } else {
      toast({
        title: "Failed to place order",
        description: result.message || "Please try again later.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (!selectedProduct) {
    return (
      <Box p={10} textAlign="center">
        <Text fontSize="2xl" color="red.500">
          No product selected.
        </Text>
      </Box>
    );
  }

  return (
    <Box minH="100vh" py={10} pt="100px">
      {orderPlaced && (
        <Box
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bg="green.500"
          color="white"
          fontSize="2xl"
          fontWeight="bold"
          px={6}
          py={4}
          borderRadius="xl"
          boxShadow="2xl"
          zIndex={9999}
        >
          Order Placed !!!
        </Box>
      )}

      <Container
        maxW="container.lg"
        p={6}
        bgColor="orange.100"
        borderRadius="2xl"
        boxShadow="xl"
      >
        <HStack spacing={10} flexDirection={{ base: "column", md: "row" }}>
          <Box flex="1" textAlign="center">
            <Image
              src={selectedProduct.image}
              alt={selectedProduct.name}
              borderRadius="xl"
              w={{ base: "250px", md: "350px" }}
              h={{ base: "250px", md: "350px" }}
              objectFit="cover"
              mx="auto"
            />
          </Box>

          <VStack flex="1" align="flex-start" spacing={4}>
            <Text fontSize="3xl" fontWeight="bold">
              {selectedProduct.name}
            </Text>
            <Text>Type: {selectedProduct.type}</Text>
            <Text>Description: {selectedProduct.description}</Text>
            <Divider />
            <Text fontSize="xl" fontWeight="semibold" color="green.800">
              Price: ₹{selectedProduct.price}
            </Text>
          </VStack>
        </HStack>


        <Box mt={10} textAlign="center">
          <Text fontSize="xl" fontWeight="semibold" mb={4}>
            Delivery Address
          </Text>

          <VStack spacing={5} align="center" width="100%">

            <FormControl isRequired isInvalid={!!errors.name} width="75%">
              <FormLabel fontWeight="semibold">Full Name</FormLabel>
              <Input
                placeholder="Enter full name"
                value={address.name}
                onChange={(e) => setAddress({ ...address, name: e.target.value })}
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.street} width="75%">
              <FormLabel fontWeight="semibold">Street Address</FormLabel>
              <Input
                placeholder="Enter street address"
                value={address.street}
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
              />
              <FormErrorMessage>{errors.street}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.city} width="75%">
              <FormLabel fontWeight="semibold">City</FormLabel>
              <Input
                placeholder="Enter city"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
              />
              <FormErrorMessage>{errors.city}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.state} width="75%">
              <FormLabel fontWeight="semibold">State</FormLabel>
              <Input
                placeholder="Enter state"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
              />
              <FormErrorMessage>{errors.state}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.pincode} width="75%">
              <FormLabel fontWeight="semibold">Pincode</FormLabel>
              <Input
                placeholder="Enter pincode"
                value={address.pincode}
                onChange={(e) =>
                  setAddress({ ...address, pincode: e.target.value })
                }
              />
              <FormErrorMessage>{errors.pincode}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.phone} width="75%">
              <FormLabel fontWeight="semibold">Phone Number</FormLabel>
              <Input
                placeholder="Enter phone number"
                value={address.phone}
                onChange={(e) =>
                  setAddress({ ...address, phone: e.target.value })
                }
              />
              <FormErrorMessage>{errors.phone}</FormErrorMessage>
            </FormControl>
          </VStack>
        </Box>

        <Box mt={8} textAlign="center">
          <Text fontSize="xl" fontWeight="semibold" mb={4}>
            Payment Method
          </Text>
          <Select
            width="50%"
            mx="auto"
            borderColor="gray.400"
            focusBorderColor="blue.500"
            borderRadius="md"
            p={2}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="COD">Cash on Delivery</option>
            <option value="GPay">GPay</option>
            <option value="PhonePe">PhonePe</option>
            <option value="Paytm">Paytm</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Net Banking">Net Banking</option>
          </Select>
        </Box>

        <Divider my={8} />

        <Text textAlign="center" fontSize="xl" fontWeight="bold" mb={2}>
          Total: ₹{selectedProduct.price}
        </Text>
        <Text textAlign="center" fontSize="sm" color="gray.600" mb={4}>
          <i>{deliveryTime}</i>
        </Text>

        <Button
          colorScheme="blue"
          onClick={handlePlaceOrder}
          isLoading={loading}
          loadingText="Placing Order..."
          size="lg"
          display="block"
          mx="auto"
        >
          Confirm Order
        </Button>
      </Container>
    </Box>
  );
};

export default BuyNowPage;


// navigate("/buyNow", { state: {...} })	Pass data when changing pages
// useLocation()	Hook that retrieves the data passed via navigation
// state	The object that contains that transferred data
// state?.product	Safely extracts the product sent from previous page