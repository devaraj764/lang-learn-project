import { Badge, Button, Container, HStack, Heading, Spacer, Tag, Tooltip, VStack, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import NavBar from '../components/Navbar'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery } from 'react-query'
import { fetchTestDetails, submitTest } from '../api/tests'
import { fetchQuestions } from '../api/questions'
import timeDifference from '../helpers/timeDifference'
import { postAnswer } from '../api/answers'
import TestQuestionsGrid from '../components/TestQuestionsGrid'

type Question = {
    _id: string
    question: string
    options: string[]
    score: number
    answer?: string
}

// count

function countQuestionsWithAnswers(questions: Question[]): number {
    return questions.reduce((count: number, question: Question) => {
        if (question.answer) {
            return count + 1;
        }
        return count;
    }, 0);
}

const LanguageTest: React.FC = () => {
    const { lang } = useParams<{ lang: string }>();
    const navigate = useNavigate();
    const toast = useToast();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answerdCount, setAnswerdCount] = useState<number>(0);

    const { mutate: questionsMutate, isLoading: questionsLoading } = useMutation({
        mutationFn: (data: { lang: string, testId: string }) => fetchQuestions(data.lang, data.testId),
        onSuccess: (data) => {
            const count = countQuestionsWithAnswers(data);
            setAnswerdCount(count)
            setQuestions(data)
        }
    });

    const postAnswerMutation = useMutation(async (data: { questionId: string; answer: string }) =>
        postAnswer(test?._id, data.questionId, data.answer),
        {
            onError: (error: Error) => {
                // Handle error (e.g., show an error message)
                console.error('Error posting answer:', error);
            },
            onSuccess: (data: any) => {
                setAnswerdCount(data?.answersCount)
                const ques = questions;
                const index= ques.findIndex(question => question._id === data.updatedData.question);
                ques[index].answer = data.updatedData.answer;
                setQuestions(ques);
                if(data.isCorrect){
                    toast({
                        title: `Yay 👏!!! you are right..`,
                        status: 'success',
                        duration: 5000, // Duration for which the toast is displayed (in milliseconds)
                    });
                }else{
                    toast({
                        title: `Sorry you choose wrong option!`,
                        status: 'error',
                        duration: 5000, // Duration for which the toast is displayed (in milliseconds)
                    });
                }
            }
        });

    const submitTestMutaion = useMutation({
        mutationFn: () => {
            // questionsRefetch();
            return submitTest(test._id, milliseconds)
        },
        onSuccess: () => {
            toast({
                title: `${test?.lang} test successfully submitted`,
                status: 'success',
                duration: 5000, // Duration for which the toast is displayed (in milliseconds)
            });
            navigate('/')
        }
    })

    const { data: test, isLoading: isTestLoading, isError: isTestError } = useQuery({
        queryKey: ['testDetails', lang],
        enabled: lang ? true : false,
        queryFn: () => {
            if (lang)
                return fetchTestDetails(lang)
        },
        onSuccess: async (data) => {
            if (lang) {
                questionsMutate({ lang, testId: data._id })
                if (localStorage.getItem(data._id))
                    setMilliseconds(parseInt(localStorage.getItem(data._id) || '0'))
                else if (data.status === 'pending') localStorage.setItem(data._id, '0')
            }
        },
        retry: 1,
        refetchOnWindowFocus: false
    });

    const [milliseconds, setMilliseconds] = useState(0);

    useEffect(() => {
        // Function to update milliseconds
        const updateMilliseconds = () => {
            if (test && test.status === 'pending') {
                const updatedMilliseconds = milliseconds + 1000; // Increment by 30 seconds
                setMilliseconds(updatedMilliseconds);
                // Store the updated value in local storage
                localStorage.setItem(test._id, updatedMilliseconds.toString());
            }
        };

        // Set an interval to update the milliseconds every 30 seconds
        const intervalId = setInterval(updateMilliseconds, 1000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [milliseconds]); // Include milliseconds in the dependency array


    if (isTestLoading) {
        return <div>Loading...</div>;
    }

    if (isTestError) {
        return <div>Error fetching data...</div>;
    }


    return (
        test &&
        <VStack>
            <NavBar />
            <Container maxW='container.xl' p={2} >
                <HStack justifyContent={'space-between'} w={'full'} flexWrap={'wrap'}>
                    <div>
                        <Heading as="h2" my={4} color={'teal'} textTransform={'capitalize'}>
                            {lang} Language Test
                        </Heading>
                        <HStack w='fit-content' mb={2}>
                            <Badge fontSize={'1em'} colorScheme='purple' textTransform='uppercase'>{test?.status}</Badge>
                            <Tag>Initiated on {timeDifference(test?.createdAt)}</Tag>
                        </HStack>
                    </div>
                    <Tag colorScheme='facebook' fontSize={'1em'}>{answerdCount} of {questions.length} answered</Tag>
                </HStack>
                <Spacer h={'1em'} />
                {
                    questionsLoading ? <Tag size={'lg'}>Loading..</Tag> :
                        <TestQuestionsGrid questionsList={questions} postAnswerMutation={postAnswerMutation} showNext={answerdCount === questions.length ? false : true} />
                }
                {
                    answerdCount === questions.length &&
                    <HStack justifyContent={'flex-end'}>
                        <Tooltip label={answerdCount !== questions.length ? 'Answer all questions to submit' : 'Submit test'}>
                            <Button isDisabled={answerdCount !== questions.length} size={'lg'} variant="solid" colorScheme='teal' disabled={submitTestMutaion.isLoading} onClick={() => submitTestMutaion.mutate()}>Submit</Button>
                        </Tooltip>
                    </HStack>
                }
            </Container >
        </VStack >
    )
}

export default LanguageTest