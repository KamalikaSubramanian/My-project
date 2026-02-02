import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Stack,
} from "@chakra-ui/react";

const HomePage = () => {
  return (
    <Box
      minH="100vh"
      bgImage="url('https://images.unsplash.com/photo-1487147264018-f937fba0c817?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFja2dyb3VuZCUyMGRlc2lnbnxlbnwwfHwwfHx8MA%3D%3D')"
      bgSize="cover"
      bgPos="center"
      bgRepeat="no-repeat"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Card
        maxW="ex-lg"
        textAlign="center"
        boxShadow="2xl"
        borderRadius="2xl"
        p={8}
        bg="whiteAlpha.900"
        backdropFilter="blur(10px)"
      >
        <CardBody>
          <Stack spacing={4}>
            <Heading size="xl" color="blue.500">
              Welcome to Unique Mart
            </Heading>
            <Text fontSize="md" color="gray.700">
              Discover a wide range of quality products at the best prices — shop easily, add to cart, and get what you love delivered fast.
            </Text>
            <Text fontSize="lg" fontWeight="semibold" color="green.600">
              🎉 Limited Time Offer: Get 40% OFF on your Pongal purchase!
            </Text>
            <Text fontSize="sm" color="gray.600">
              <i>Register to explore exclusive deals or create a new account and
                start shopping today.</i>
            </Text>
          </Stack>
        </CardBody>

        <CardFooter justify="center" gap={4} color="red.500">
          <b>Enjoy your shopping with wide range of products.</b>
        </CardFooter>
      </Card>
    </Box>
  );
};

export default HomePage;

//  spacing= 1 = 8px