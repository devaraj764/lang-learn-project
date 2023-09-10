import React, { useState, useContext } from 'react';
import { Container, Heading, Text, Button, VStack, useDisclosure, Grid, GridItem, Spacer, Tooltip } from '@chakra-ui/react';
import { fetchLanguages } from '../api/questions'
import TestOverview from '../components/TestOverview';
import NavBar from '../components/Navbar';
import { useQuery } from 'react-query';
import LeaderBoard from '../components/LeaderBoard';
import { MyContext } from '../App';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const { data: languages, isLoading, isError } = useQuery('languages', fetchLanguages);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const context = useContext(MyContext);
    const navigate = useNavigate()

    if (isLoading) {
        return <div>Loading languages...</div>;
    }

    if (isError) {
        return <div>Error fetching languages.</div>;
    }


    const handleClick = (lang: string): void => {
        if (context?.user.role === 'user') {
            setSelectedLanguage(lang);
            onOpen();
        } else {
            navigate(`./test/${lang}`);
        }
    }

    return (
        <VStack width={'100%'}>
            <NavBar />
            <Container maxW='container.xl' p={2} >
                <Heading as="h2" my={4} color={'teal'}>
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
                            <Tooltip label={context?.user.role === 'admin' ? `Edit ${language} Language`: `Write ${language} test`}>
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
                </Grid>
                <Spacer height="1em" />
                {
                    languages && <LeaderBoard languages={languages} />
                }
            </Container>
            <TestOverview isOpen={isOpen} onClose={onClose} language={selectedLanguage} />
        </VStack>
    );
};

export default LandingPage;
