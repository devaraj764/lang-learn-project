import React, { useState, useEffect } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useToast,
    Alert,
    HStack,
    Text,
    ListItem,
    UnorderedList,
    Heading,
    Tag,
} from '@chakra-ui/react'
import { useMutation } from 'react-query'
import { createTest, fetchTestDetails, retakeTest } from '../api/tests'
import { Link, useNavigate } from 'react-router-dom'
import { MdIntegrationInstructions } from 'react-icons/md'
import { fetchLanguageDetails } from '../api/questions'
import millisecondsToTime from '../helpers/convertMilliSecondsToTime'

interface Props {
    isOpen: boolean
    onClose: () => void
    language: string
}

interface TestType {
    user: string, // Set the user ID from the header
    lang: string,
    completionTime: number,
    status: string,
    score: number,
    _id: string
}

const TestOverview: React.FC<Props> = ({ isOpen, onClose, language }: Props) => {
    const toast = useToast();
    const [test, setTest] = useState<TestType | null>(null);
    const navigate = useNavigate()

    const testDetailsMutation = useMutation((lang: string) => fetchTestDetails(lang), {
        onSuccess: (data) => {
            // setting the test details if the user already took the test
            setTest(data)
        },
    });

    // fetching language details
    const languageDetailsMutation = useMutation({
        mutationFn: (lang: string) => fetchLanguageDetails(lang),
    })


    // creating new test for the selected language
    const createTestMutation = useMutation((lang: string) => createTest(lang), {
        onSuccess: () => {
            console.log('New test created');
            navigate(`/test/${language}`);
        },
        onError: (error: any) => {
            // Handle error (e.g., show an error message)
            console.error('Error creating test:', error);
            toast({
                title: 'Sorry',
                description: error.response.data.error,
                status: 'error',
                duration: 5000, // Duration for which the toast is displayed (in milliseconds)
                isClosable: true, // Allow the user to close the toast
            });
        },
    });

    // creating new test for the selected language
    const retakeTestMutation = useMutation((testId: string) => retakeTest(testId), {
        onSuccess: () => {
            console.log('Retake test');
            navigate(`/test/${language}`);
        },
        onError: (error: any) => {
            // Handle error (e.g., show an error message)
            console.error('Error creating test:', error);
            toast({
                title: 'Sorry',
                description: error.response.data.error,
                status: 'error',
                duration: 5000, // Duration for which the toast is displayed (in milliseconds)
                isClosable: true, // Allow the user to close the toast
            });
        },
    });



    const handleCreateTest = (lang: string) => {
        createTestMutation.mutate(lang);
    };

    useEffect(() => {
        if (isOpen) {
            testDetailsMutation.mutate(language);
            languageDetailsMutation.mutate(language);
        }
    }, [isOpen])

    const handleClose = async () => {
        setTest(null);
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size={'3xl'}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textTransform={'capitalize'}>{language} Language Test</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Alert rounded={'md'} mb={3}>
                        <div>
                            <HStack gap="10px" mb={2}>
                                <MdIntegrationInstructions size={24} />
                                <Heading fontSize={'16px'} margin={0} padding={0}>Instructions</Heading>
                            </HStack>
                            <UnorderedList>
                                <ListItem>Answer all questions to submit the test</ListItem>
                                <ListItem>The test will have marks according to level of difficulty</ListItem>
                                <ListItem>You can resume the test and continue later.</ListItem>
                                <ListItem>Retaking test will remove all the records of attempted test results.</ListItem>
                            </UnorderedList>
                        </div>
                    </Alert>
                    <Alert rounded={'md'} colorScheme='yellow' mb={2}>
                        <div>
                            <HStack gap="10px" mb={2}>
                                <MdIntegrationInstructions size={24} />
                                <Heading fontSize={'16px'} margin={0} padding={0}>Test Details</Heading>
                            </HStack>
                            <UnorderedList>
                                <ListItem>Language test on {languageDetailsMutation?.data?.language}</ListItem>
                                <ListItem>Total questions {languageDetailsMutation?.data?.numberOfQuestions}</ListItem>
                                <ListItem>Total Score {languageDetailsMutation?.data?.totalScore}</ListItem>
                                <ListItem>Recorded tests till date {languageDetailsMutation?.data?.totalTestsRecorded}</ListItem>
                            </UnorderedList>
                        </div>
                    </Alert>
                    {
                        test?.status === 'completed' &&
                        <>
                            <HStack mt={3}>
                                <Text>Your Test results</Text>
                                <Tag>Score: {test.score} / {languageDetailsMutation?.data?.totalScore}</Tag>
                                <Tag>Time Taken: {millisecondsToTime(test.completionTime)} </Tag>
                            </HStack>
                        </>
                    }
                </ModalBody>
                <ModalFooter>
                    {
                        !test ?
                            <Button colorScheme='teal' onClick={() => handleCreateTest(language)}>Take Test</Button>
                            : test.status === 'completed' ?
                                <Button colorScheme='yellow' onClick={() => retakeTestMutation.mutate(test._id)}>Retake Test</Button>
                                :
                                <Button colorScheme='linkedin' as={Link} to={`/test/${language}`}>Resume Test</Button>
                    }
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default TestOverview