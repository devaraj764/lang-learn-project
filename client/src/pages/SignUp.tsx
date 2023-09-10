// SignUp.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Center, Box, Heading, Input, Button, FormControl, FormErrorMessage, Container, Flex, Spacer, useToast } from '@chakra-ui/react';


interface SignUpFormData {
    name: string;
    email: string;
    password: string;
}

const SignUp: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>();
    const navigate = useNavigate();
    const toast = useToast();

    const onSubmit = async (data: SignUpFormData) => {
        try {
            const response = await axios.post('http://localhost:3001/auth/signup', data);
            if (response.status === 200 || response.status === 201) {
                toast({
                    title: 'Sign Up Successful',
                    description: 'You have successfully signed up.',
                    status: 'success',
                    duration: 5000, // Duration for which the toast is displayed (in milliseconds)
                    isClosable: true, // Allow the user to close the toast
                });
                navigate('/login'); // Redirect to the login screen after successful signup
            }
        } catch (error:any) {
            console.error('Error signing up:', error);
            toast({
                title: 'Sign Up Error',
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
                        Sign Up
                    </Heading>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl isInvalid={!!errors.name} py={2}>
                            <Input type="text" placeholder="Full Name" {...register('name', { required: true })} />
                            <FormErrorMessage>Name is required</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.email} py={2}>
                            <Input type="email" placeholder="Email" {...register('email', { required: true })} />
                            <FormErrorMessage>Email is required</FormErrorMessage>
                        </FormControl>
                        <Spacer />
                        <FormControl isInvalid={!!errors.password} py={2}>
                            <Input type="password" placeholder="Password" {...register('password', { required: true })} />
                            <FormErrorMessage>Password is required</FormErrorMessage>
                        </FormControl>
                        <Flex>
                            <Button mt={4} mr={1} onClick={() => navigate('/login')} variant="outline" colorScheme="teal" w='100%'>
                                Already a user?
                            </Button>
                            <Button mt={4} ml={1} colorScheme="teal" type="submit" w='100%'>
                                Signup
                            </Button>
                        </Flex>
                    </form>
                </Box>
            </Container>
        </Center>
    );
};

export default SignUp;
