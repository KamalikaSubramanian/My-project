import React from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
  Select,
  useColorModeValue,
  HStack,
  useToast,
  FormErrorMessage
} from "@chakra-ui/react";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUserStore } from '../store/user.js';

const RegisterPage = () => {

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: ""
  })
  const [errors, setErrors] = useState({});
  const { registerUser } = useUserStore();
  const toast = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!newUser.username.trim()) {
      newErrors.username = "Username is required"
    }
    if (!newUser.password.trim()) {
      newErrors.password = "Password is required"
    }
    else if (newUser.password.trim().length < 6) {
      newErrors.password = "Password must be atleast 6 characters"
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0
  }
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm())
      return;

    const { success, message, role } = await registerUser(newUser);
    console.log("Register RESULT:", success, message);
    if (!success) {
      toast({
        title: "Error",
        description: message,
        status: "error",
        isClosable: true,
      });
    }
    else {
      if (role === "admin") {
        navigate("/admin/product")
      }
      else if (role === "user") {
        navigate("/user/product")
      }
      toast({
        title: "Success",
        description: message,
        status: "success",
        isClosable: true,
      })
    }
    setNewUser({ name: "", password: "", role: "" })

  }
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue("gray.100", "gray.900")}
      px={4}
      bgImage="url('https://images.unsplash.com/photo-1487147264018-f937fba0c817?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFja2dyb3VuZCUyMGRlc2lnbnxlbnwwfHwwfHx8MA%3D%3D')"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      bgAttachment="fixed"
    >
      <Box
        bg={useColorModeValue("white", "gray.800")}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        maxW="md"
        w="full"

      >
        <Stack spacing={6} >
          <Heading textAlign="center" size="lg" color="blue.600">
            Create an Account
          </Heading>

          <FormControl id="name" isRequired isInvalid={!!errors.username}>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              placeholder="Enter your name"
              name='username'
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
            <FormErrorMessage>{errors.username}</FormErrorMessage>
          </FormControl>

          <FormControl id="password" isRequired isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              name='password'
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          <FormControl id="email" isRequired isInvalid={!!errors.role}>
            <FormLabel>Role</FormLabel>
            <Select
              width="100%"
              mx="auto"
              borderColor="gray.400"
              focusBorderColor="blue.500"
              borderRadius="md"
              p={2}
              value={newUser.role}
              onChange={(e) =>setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="admin">admin</option>
              <option value="user">user</option>
            </Select>
            <FormErrorMessage>{errors.role}</FormErrorMessage>
          </FormControl>

          <Button colorScheme="blue" size="lg" mt={2} onClick={handleRegister}>
            Register
          </Button>

          <HStack justify="center">
            <Text fontSize="sm">Already have an account?</Text>
            <Link to={'/login'}>
              <Button variant="link" colorScheme="blue" size="sm" >
                Login
              </Button>
            </Link>
          </HStack>
        </Stack>
      </Box>
    </Box>
  );
};

export default RegisterPage;
