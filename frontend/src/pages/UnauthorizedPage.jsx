import { Box, Button,Heading,Text } from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const UnauthorizedPage = () => {
    const navigate = useNavigate()
    return (
        <Box
            minH="100vh"
            display="flex"
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            bg="gray.100"
            textAlign={"center"}
            p={6}
        >
            <Heading mb={4} color="red.500">
                Access Denied ***
            </Heading>
            <Text fontSize="lg" mb={6}>
                You do not have a permit to view this page.
            </Text>
            <Button colorScheme='blue' onClick={() => navigate("/")}>
                Go to home
            </Button>
        </Box>
    )
}

export default UnauthorizedPage;