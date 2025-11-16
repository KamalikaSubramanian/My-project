import {
  Box,
  Text,
  VStack,
  Divider,
  Spinner,
  HStack,
  Badge,
  Image,
  Card,
  CardHeader,
  CardBody,
  Stack,
  Icon,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useOrderStore } from "../store/order.js";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const MyOrdersListPage = () => {
  const userId = localStorage.getItem("userId");
  const orders = useOrderStore((state)=>state.orders);
  const fetchOrderByUser = useOrderStore((state)=>state.fetchOrderByUser);
  const loading = useOrderStore((state)=>state.loading);


  useEffect(() => {
    if (userId) fetchOrderByUser(userId);
  }, [userId, fetchOrderByUser]);

  if (loading)
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgImage="url('https://images.unsplash.com/photo-1487147264018-f937fba0c817?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFja2dyb3VuZCUyMGRlc2lnbnxlbnwwfHwwfHx8MA%3D%3D')"
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        bgAttachment="fixed"
      >
        <Spinner size="xl" color="teal.500" />
      </Box>
    );

  if (!Array.isArray(orders) || orders.length === 0)
    return (
      <Box
        minH="100vh"
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        bgImage="url('https://images.unsplash.com/photo-1487147264018-f937fba0c817?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFja2dyb3VuZCUyMGRlc2lnbnxlbnwwfHwwfHx8MA%3D%3D')"
			bgSize="cover"
			bgPosition="center"
			bgRepeat="no-repeat"
			bgAttachment="fixed"
        textAlign="center"
      >
        <Text fontSize="3xl" fontWeight="bold" color="purple.600">
          No Orders Found
        </Text>
        <Text color="gray.600">You haven’t placed any orders yet!</Text>
      </Box>
    );

  return (
    <Box p={8} minH="100vh" bgImage="url('https://images.unsplash.com/photo-1487147264018-f937fba0c817?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFja2dyb3VuZCUyMGRlc2lnbnxlbnwwfHwwfHx8MA%3D%3D')"
			bgSize="cover"
			bgPosition="center"
			bgRepeat="no-repeat"
			bgAttachment="fixed">
      <Text
        fontSize="3xl"
        fontWeight="bold"
        textAlign="center"
        mb={8}
        mt={8}
        bgGradient="linear(to-r, teal.500, blue.600)"
        bgClip="text"
      >
        My Orders
      </Text>

      <VStack align="stretch" spacing={6}>
        {Array.isArray(orders) &&
          orders.map((order) => (
            <Card
              key={order._id}
              boxShadow="md"
              borderRadius="2xl"
              bg="white"
              _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
              transition="0.3s ease"
            >
              <CardHeader bg="teal.500" color="white" borderTopRadius="2xl">
                <HStack justify="space-between">
                  <Text fontWeight="bold">Order ID: {order._id}</Text>
                  <Badge
                    colorScheme={
                      order.status === "Delivered"
                        ? "green"
                        : order.status === "Processing"
                          ? "yellow"
                          : "red"
                    }
                    px={3}
                    py={1}
                    borderRadius="lg"
                  >
                    {order.status}
                  </Badge>
                </HStack>
              </CardHeader>

              <CardBody>
                <Stack spacing={3}>
                  <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                    Total Amount:{" "}
                    <Text as="span" color="teal.600">
                      ₹{order.totalAmount}
                    </Text>
                  </Text>

                  <Text fontSize="sm" color="gray.600">
                    Payment Method:{" "}
                    <Text as="span" fontWeight="medium" color="blue.600">
                      {order.paymentMethod}
                    </Text>
                  </Text>

                  {order.deliveryDate && (
                    <Text fontSize="sm" color="gray.600">
                      Delivery Date:{" "}
                      <Text as="span" fontWeight="medium" color="blue.600">
                        {new Date(order.deliveryDate).toDateString()}
                      </Text>
                    </Text>
                  )}

                  <Divider />

                  {order.address && (
                    <Box
                      p={4}
                      bg="gray.50"
                      borderRadius="lg"
                      borderWidth="1px"
                      boxShadow="sm"
                    >
                      <Text
                        fontWeight="bold"
                        fontSize="md"
                        color="gray.700"
                        mb={2}
                      >
                        Shipping Address
                      </Text>

                      <VStack align="start" spacing={1}>
                        <Text fontWeight="semibold" color="gray.700">
                          {order.address.name}
                        </Text>

                        <HStack align="start">
                          <Icon as={FaMapMarkerAlt} color="teal.500" />
                          <Text color="gray.600">
                            {order.address.street}, {order.address.city},{" "}
                            {order.address.state} - {order.address.pincode}
                          </Text>
                        </HStack>

                        <HStack>
                          <Icon as={FaPhoneAlt} color="blue.500" />
                          <Text color="gray.600">{order.address.phone}</Text>
                        </HStack>
                      </VStack>
                    </Box>
                  )}

                  <Divider />

                  <Text fontWeight="bold" fontSize="md" color="gray.700">
                    Products:
                  </Text>

                  <VStack align="stretch" spacing={3}>
                    {Array.isArray(order.products) &&
                      order.products.map((p, idx) => (
                        <HStack
                          key={p._id || idx}
                          spacing={4}
                          p={3}
                          borderWidth="1px"
                          borderRadius="xl"
                          bg="gray.50"
                          _hover={{ bg: "teal.50" }}
                          transition="0.2s"
                        >
                          {p.image && (
                            <Image
                              src={p.image}
                              alt={p.name}
                              boxSize="70px"
                              borderRadius="lg"
                              objectFit="cover"
                            />
                          )}
                          <Box>
                            <Text fontWeight="semibold" color="gray.800">
                              {p.name}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              Type: {p.type}
                            </Text>
                            <Text color="teal.600" fontWeight="medium">
                              ₹{p.price}
                            </Text>
                          </Box>
                        </HStack>
                      ))}
                  </VStack>
                </Stack>
              </CardBody>
            </Card>
          ))}
      </VStack>
    </Box>
  );
};

export default MyOrdersListPage;



