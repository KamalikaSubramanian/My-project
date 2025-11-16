import React, { useEffect, useState } from "react";
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
  Card,
  CardBody,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useCartStore } from "../store/cart.js";
import { useOrderStore } from "../store/order.js";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  const toast = useToast();
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const cart = useCartStore((state) => state.cart);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const placeOrder = useOrderStore((state) => state.placeOrder);

  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const deliveryTime = "Expected delivery within 4–6 business days.";

  useEffect(() => {
    if (userId) fetchCart(userId);
  }, [userId, fetchCart]);

  const validateFields = () => {
    const newErrors = {};

    if (!address.name.trim()) newErrors.name = "Name is required.";
    if (!address.street.trim()) newErrors.street = "Street address is required.";
    if (!address.city.trim()) newErrors.city = "City is required.";
    if (!address.state.trim()) newErrors.state = "State is required.";

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

  const handlePlaceOrder = async () => {
    if (!userId) {
      toast({
        title: "User not logged in",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (!cart || !cart.products?.length) {
      toast({
        title: "Your cart is empty!",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (!validateFields()) {
      toast({
        title: "Please correct the errors before placing your order.",
        status: "warning",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    const orderProducts = cart.products.map((item) => ({
      productId: item._id ? item._id.toString() : item.productId,
      name: item.name,
      description: item.description,
      type: item.type,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      deliveryTime: item.deliveryTime,
    }));

    setLoading(true);
    const result = await placeOrder(userId, orderProducts, address, paymentMethod);
    setLoading(false);

    try {
      if (result.success) {
        setOrderPlaced(true);
        setTimeout(() => {
          setOrderPlaced(false);
          navigate("/myOrderList");
        }, 2000);
      } else {
        toast({
          title: "Failed to place order",
          description: result.message,
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error placing order",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW="900px"
      mx="auto"
      p={8}
      pt="100px"
      borderRadius="lg"
      bg="white"
      boxShadow="xl"
      transition="all 0.3s ease"
      _hover={{ boxShadow: "2xl" }}
      position="relative"
    >
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
          textAlign="center"
          animation="fadeInOut 2s forwards"
        >
          ✅ Order Placed Successfully!
        </Box>
      )}

      <Text fontSize="3xl" fontWeight="bold" mb={8} textAlign="center" color="blue.600">
        Review & Confirm Your Order
      </Text>

      <Box mb={8}>
        <Text fontSize="xl" fontWeight="semibold" mb={4} textAlign="center">
          Delivery Address
        </Text>

        <VStack spacing={4} align="stretch" width="70%" mx="auto">
          <FormControl isRequired isInvalid={!!errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Enter your full name"
              value={address.name}
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.street}>
            <FormLabel>Street</FormLabel>
            <Input
              placeholder="Enter street address"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
            />
            <FormErrorMessage>{errors.street}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.city}>
            <FormLabel>City</FormLabel>
            <Input
              placeholder="Enter city"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
            <FormErrorMessage>{errors.city}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.state}>
            <FormLabel>State</FormLabel>
            <Input
              placeholder="Enter state"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
            />
            <FormErrorMessage>{errors.state}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.pincode}>
            <FormLabel>Pincode</FormLabel>
            <Input
              placeholder="Enter pincode"
              type="number"
              value={address.pincode}
              onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
            />
            <FormErrorMessage>{errors.pincode}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.phone}>
            <FormLabel>Phone Number</FormLabel>
            <Input
              placeholder="Enter phone number"
              type="tel"
              value={address.phone}
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            />
            <FormErrorMessage>{errors.phone}</FormErrorMessage>
          </FormControl>
        </VStack>
      </Box>

      <Box mb={10} textAlign="center">
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
          <option value="PhonePe">PhonePe</option>
          <option value="Paytm">Paytm</option>
          <option value="UPI">UPI</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="Net Banking">Net Banking</option>
        </Select>
      </Box>

      <VStack spacing={5} mb={6}>
        {cart?.products?.map((item, index) => (
          <Card
            key={index}
            width="75%"
            mx="auto"
            borderRadius="lg"
            boxShadow="sm"
            bg="gray.50"
            transition="all 0.3s ease"
            _hover={{ transform: "scale(1.03)", boxShadow: "xl", bg: "white" }}
          >
            <CardBody>
              <HStack spacing={6}>
                <Image
                  src={item.image || "https://dummyimage.com/100x100/cccccc/000000&text=No+Image"}
                  alt={item.name}
                  boxSize="90px"
                  borderRadius="md"
                  objectFit="cover"
                />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">{item.name}</Text>
                  <Text>Price: ₹{item.price}</Text>
                  <Text>Qty: {item.quantity}</Text>
                </VStack>
              </HStack>
            </CardBody>
          </Card>
        ))}
      </VStack>

      <Divider mb={4} />

      <Text textAlign="center" fontSize="xl" fontWeight="bold" mb={2}>
        Total: ₹{cart?.products?.reduce((sum, item) => sum + item.price * item.quantity, 0)}
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
        _hover={{ transform: "scale(1.05)", boxShadow: "md", bg: "blue.600" }}
      >
        Confirm Order
      </Button>
    </Box>
  );
};

export default OrderPage;

