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
  const [loading, setLoading] = useState(false);
  const registerUser = useUserStore((state) => state.registerUser);
  
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

    setLoading(true);

    const { success, message } = await registerUser(newUser);

    setLoading(false);

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
      setTimeout(() => navigate("/login"), 300);
      toast({
        title: "Success",
        description: message,
        status: "success",
        isClosable: true,
      })
    }
    setNewUser({ username: "", password: "", role: "" })

  }
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
      bgImage="url('https://images.unsplash.com/photo-1487147264018-f937fba0c817?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFja2dyb3VuZCUyMGRlc2lnbnxlbnwwfHwwfHx8MA%3D%3D')"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      bgAttachment="fixed"
    >
      <Box
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
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
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

// In React, whenever something happens (typing, clicking, focusing), React sends an event object to the function.
// onChange → runs when user types in an input box
// (e) → e = event object
// e.target → the HTML element that triggered the event (the input box)
// e.target.value → the current text inside the input
// const { registerUser } = useUserStore(); => extracts full store, then destructure,Re-renders when ANY part of the store changes.
//   const registerUser = useUserStore((state) => state.registerUser); => extracts only registerUser,Re-renders only when registerUser changes
// (state) => state.registerUser → a selector function.Zustand passes the entire store as state.You return only what you want → here: the registerUser function.
// Why we use newErrors first?
// 1️⃣ You need to collect all errors BEFORE updating the UI

// You cannot update errors one by one.
// Collect all → then show all.

// Directly set errors inside if
// ❌ Overwrites previous errors, ❌ multiple re-renders, ❌ cannot return validation result

// Build a newErrors object first
// ✅ Collect all errors, ✅ one re-render, ✅ clean & predictable code, ✅ allows return true/false