import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  useColorModeValue,
  useToast,
  FormErrorMessage
} from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/user.js';

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginUser = useUserStore((state) => state.loginUser)

  // “From my Zustand store, give me access to the loginUser() function (so I can trigger login) and also the error variable (so I can read any login or registration errors).”

  const toast = useToast();

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required"
    }
    else if (password.trim().length < 6) {
      newErrors.password = "Password must be atleast 6 characters."
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;

  }
  const handleLogin = async (e) => {
    e.preventDefault();
    // By default, when you submit a form or click a button of type submit inside a <form>, the browser automatically reloads the page.That’s the traditional HTML behavior (used before single-page apps like React).
    // It prevents that default form submission behavior (page reload).
    // This allows your JavaScript (React) function to:
    // Stay on the same page.
    // Send the login request using fetch or axios.
    // Handle the server response (e.g., success or error).
    // Show a toast or navigate to another route.

    if (!validateForm())
      return;

    setLoading(true);

    const credentials = { username, password };
    const { success, message, role } = await loginUser(credentials);
    console.log("LOGIN RESULT:", success, message, role);
    setLoading(false);

    if (!success) {
      toast({
        title: "Error",
        description: message,
        status: "error",
        isClosable: true
      })
    }
    else {
      if (role === "admin") {
        setTimeout(() => navigate("/admin/product"), 200);
      }
      else if (role === "user") {
        setTimeout(() => navigate("/user/product"), 200);
      }
      toast({
        title: "Success",
        description: message,
        status: "success",
        isClosable: true
      })
    }
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
        <Stack spacing={6}>
          <Heading textAlign="center" size="lg" color="blue.600">
            Login
          </Heading>

          <FormControl id="name" isRequired isInvalid={!!errors.username}>
            {/* isRequired Marks field as mandatory, Adds red asterisk */}
            {/* errors.password → if there’s an error message (e.g. "Password is required")
!!errors.password → converts it to a boolean
!!"Password is required" → true
!!undefined → false
If errors.password exists → isInvalid={true} */}
{/* !!value - “convert value to true/false” - boolean version ,Two NOTs cancel each other out —
but in the process, it forces a value to become a boolean.*/}
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              placeholder="Enter your name"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} />
            <FormErrorMessage>{errors.username}</FormErrorMessage>
          </FormControl>

          <FormControl id="password" isRequired isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          <Button colorScheme="blue" size="lg" mt={2} onClick={handleLogin} isLoading={loading}>
            Login
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default LoginPage;
// You click Login.

// handleLogin() runs.

// It calls loginUser(credentials) → this function is defined inside Zustand.

// That function sends a POST request to your backend /api/auth/login.

// Depending on the response:

// It updates the Zustand store (set({ user, token, error }))

// You get back { success, message }

// If login fails, error will contain the error text, which you can display to the user.