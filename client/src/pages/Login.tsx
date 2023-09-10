// Login.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Center, Box, Heading, Input, Button, FormControl, FormErrorMessage, Container, Flex, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface LoginFormData {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
    const navigate = useNavigate();
    const toast = useToast();

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await axios.post('http://localhost:3001/auth/login', data);
            // Handle login success and other logic here
            if (response.status === 200) {
                const { token } = response.data; // Assuming your API returns a token
                localStorage.setItem('token', token); // Store the token in session storage
                toast({
                    title: 'Login Successful',
                    description: 'You have successfully logged in.',
                    status: 'success',
                    duration: 5000, // Duration for which the toast is displayed (in milliseconds)
                    isClosable: true, // Allow the user to close the toast
                });
                // Handle login success and other logic here
                window.location.href = '/';
            }
        } catch (error: any) {
            console.error('Error logging in:', error);
            toast({
                title: 'Login Error',
                description: error.response.data.error,
                status: 'error',
                duration: 5000, // Duration for which the toast is displayed (in milliseconds)
                isClosable: true, // Allow the user to close the toast
            });
        }
    };

    return (
        <Center height="100vh">
            <Container>
                <Box w='100%' p={4} borderWidth="1px" borderRadius="md">
                    <Heading size="lg" mb={4}>
                        Login
                    </Heading>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl isInvalid={!!errors.email} py={2}>
                            <Input type="email" placeholder="Email" {...register('email', { required: true })} />
                            <FormErrorMessage>Email is required</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.password} py={2}>
                            <Input type="password" placeholder="Password" {...register('password', { required: true })} />
                            <FormErrorMessage>Password is required</FormErrorMessage>
                        </FormControl>
                        <Flex>
                            <Button mt={4} mr={1} onClick={() => navigate('/signup')} variant="outline" colorScheme="teal" w='100%'>
                                Create Account
                            </Button>
                            <Button mt={4} ml={1} colorScheme="teal" type="submit" w='100%'>
                                Login
                            </Button>
                        </Flex>
                    </form>
                </Box>
            </Container>
        </Center>
    );
};

export default Login;
