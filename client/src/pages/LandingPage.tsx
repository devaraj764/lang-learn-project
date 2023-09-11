import React, { useState, useContext } from 'react';
import { Container, Heading, Text, Button, VStack, useDisclosure, Grid, GridItem, Spacer, Tooltip, useToast, Divider } from '@chakra-ui/react';
import { fetchLanguages, updateQuestion } from '../api/questions'
import TestOverview from '../components/TestOverview';
import NavBar from '../components/Navbar';
import { useMutation, useQuery } from 'react-query';
import LeaderBoard from '../components/LeaderBoard';
import { MyContext } from '../App';
import { useNavigate } from 'react-router-dom';
import QuestionModal from '../components/QuestionModal';

const LandingPage: React.FC = () => {
    const { data: languages, isLoading, isError } = useQuery('languages', fetchLanguages);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const context = useContext(MyContext);
    const navigate = useNavigate();
    const toast = useToast();


    const handleClick = (lang: string): void => {
        if (context?.user.role === 'user') {
            setSelectedLanguage(lang);
            onOpen();
        } else {
            navigate(`./test/${lang}`);
        }
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleQuestionChange = useMutation({
        mutationFn: (props: { data: any }) => updateQuestion(undefined, props.data),
        onSuccess: (data: any) => {
            navigate(`/admin/test/${data.updatedQuestion.language}`)
        },
        onError: (error: any) => {
            console.error('Error logging in:', error);
            toast({
                title: 'Error',
                description: error.response.data.error,
                status: 'error',
                duration: 2000, // Duration for which the toast is displayed (in milliseconds)
                isClosable: true, // Allow the user to close the toast
            });
        }
    })

    if (isLoading) {
        return <div>Loading languages...</div>;
    }

    if (isError) {
        return <div>Error fetching languages.</div>;
    }
    return (
        <VStack width={'100%'}>
            <NavBar />
            <Container maxW='container.xl' p={2} >
                <Text fontSize={'20px'}>
                    Hello 👋 
                </Text>
                <Text  fontSize={'24px'} fontWeight={'bold'} mb={2}>{context?.user.name}!</Text>
                <Divider />
                <Heading as="h2" my={4}  color={'teal'}>
                    Language Tests
                </Heading>
                <Text>Choose a language test to take:</Text>
                <Grid
                    display="grid"
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }}
                    gap={4}
                    minW="360px"
                    my={'1em'}
                >
                    {/* Your grid items go here */}
                    {languages?.map((language: string, index: number) => (
                        <GridItem key={index}>
                            <Tooltip label={context?.user.role === 'admin' ? `Edit ${language} Language` : `Write ${language} test`}>
                                <Button
                                    colorScheme="gray"
                                    variant={'outline'}
                                    p={7}
                                    fontSize={'1.2em'}
                                    textTransform={'capitalize'}
                                    onClick={() => handleClick(language)}
                                    width={'100%'}
                                >
                                    {language}
                                </Button>
                            </Tooltip>
                        </GridItem>
                    ))}
                    {
                        context?.user.role === 'admin' &&
                        <GridItem>
                            <Tooltip label={`Write new language test`}>
                                <Button
                                    colorScheme="teal"
                                    p={7}
                                    fontSize={'1.2em'}
                                    textTransform={'capitalize'}
                                    width={'100%'}
                                    onClick={openModal}
                                >
                                    Add Language
                                </Button>
                            </Tooltip>
                        </GridItem>
                    }
                </Grid>
                <Spacer height="1em" />
                {
                    languages && <LeaderBoard languages={languages} />
                }
            </Container>
            <TestOverview isOpen={isOpen} onClose={onClose} language={selectedLanguage} />
            <QuestionModal isOpen={isModalOpen} onClose={closeModal} createQuestion={handleQuestionChange} />
        </VStack>
    );
};

export default LandingPage;
