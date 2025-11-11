import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Image,
  Text,
  useDisclosure,
  useToast,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useProductStore } from "../store/product";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [updatedProduct, setUpdatedProduct] = useState(product);
  const [errors, setErrors] = useState({});

  const { deleteProduct, updateProduct } = useProductStore();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const validateForm = () => {
    const newErrors = {};

    if (!updatedProduct.name.trim()) newErrors.name = "Product name is required";
    if (!updatedProduct.price.toString().trim()) newErrors.price = "Price is required";
    if (!updatedProduct.image.trim()) newErrors.image = "Image URL is required";
    if (!updatedProduct.type.trim()) newErrors.type = "Type is required";
    if (!updatedProduct.description.trim()) newErrors.description = "Description is required";
    if (!updatedProduct.deliveryTime.trim()) newErrors.deliveryTime = "Delivery time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeleteProduct = async (pid) => {
    const { success, message } = await deleteProduct(pid);
    toast({
      title: success ? "Success" : "Error",
      description: message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleUpdateProduct = async (pid, updatedProduct) => {
    if (!validateForm()) return;

    const { success, message } = await updateProduct(pid, updatedProduct);
    onClose();

    toast({
      title: success ? "Success" : "Error",
      description: success ? "Product updated successfully" : message,
      status: success ? "success" : "error",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box
      shadow="lg"
      rounded="lg"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
      bg={bg}
    >
      <Image
        src={product.image}
        alt={product.name}
        h={48}
        w="full"
        objectFit="contain"
        cursor="pointer"
        onClick={() => navigate(`/admin/product/${product._id}`)}
        _hover={{ transform: "scale(1.05)", transition: "0.3s ease-in-out" }}
      />

      <Box p={4}>
        <Heading
          as="h3"
          size="md"
          mb={2}
          cursor="pointer"
          onClick={() => navigate(`/admin/product/${product._id}`)}
        >
          {product.name}
        </Heading>

        <Text fontWeight="bold" fontSize="xl" color={textColor} mb={4}>
          ₹{product.price}
        </Text>

        <HStack spacing={2}>
          <IconButton icon={<EditIcon />} onClick={onOpen} colorScheme="blue" />
          <IconButton
            icon={<DeleteIcon />}
            onClick={() => handleDeleteProduct(product._id)}
            colorScheme="red"
          />
        </HStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Product</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired isInvalid={!!errors.name}>
                <FormLabel>Product Name</FormLabel>
                <Input
                  placeholder="Enter product name"
                  value={updatedProduct.name}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, name: e.target.value })
                  }
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.price}>
                <FormLabel>Price</FormLabel>
                <Input
                  type="number"
                  placeholder="Enter price"
                  value={updatedProduct.price}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, price: e.target.value })
                  }
                />
                <FormErrorMessage>{errors.price}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.image}>
                <FormLabel>Image URL</FormLabel>
                <Input
                  placeholder="Enter image URL"
                  value={updatedProduct.image}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, image: e.target.value })
                  }
                />
                <FormErrorMessage>{errors.image}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.type}>
                <FormLabel>Type</FormLabel>
                <Input
                  placeholder="Enter type"
                  value={updatedProduct.type}
                  onChange={(e) =>
                    setUpdatedProduct({ ...updatedProduct, type: e.target.value })
                  }
                />
                <FormErrorMessage>{errors.type}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.description}>
                <FormLabel>Description</FormLabel>
                <Input
                  placeholder="Enter description"
                  value={updatedProduct.description}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      description: e.target.value,
                    })
                  }
                />
                <FormErrorMessage>{errors.description}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.deliveryTime}>
                <FormLabel>Delivery Time</FormLabel>
                <Input
                  placeholder="Enter delivery time"
                  value={updatedProduct.deliveryTime}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      deliveryTime: e.target.value,
                    })
                  }
                />
                <FormErrorMessage>{errors.deliveryTime}</FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => handleUpdateProduct(product._id, updatedProduct)}
            >
              Update
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductCard;
