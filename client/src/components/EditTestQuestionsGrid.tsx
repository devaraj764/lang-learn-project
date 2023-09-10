import { Box, HStack,  Radio, RadioGroup, Spacer, Text } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from './Pagination';
import DelayInputField from './DelayInputField';
import { useMutation } from 'react-query';
import { updateQuestion } from '../api/questions';
import { useState } from 'react'

type Question = {
    _id: string
    question: string
    options: string[]
    score: number
    answer?: string
    correct_answer?: string
}

const EditTestQuestionsGrid = ({ questionsList }: { questionsList: Question[] }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get('page') || '1');

    // Assuming you have a list of questions
    var [questions, setQuestions] = useState(questionsList);
    const questionsPerPage = 5; // Adjust as needed

    // Calculate the range of questions to display
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;

    const handlePageChange = (page: number) => {
        queryParams.set('page', page.toString());
        navigate(`.?${queryParams.toString()}`);
    };

    const handleQuestionChange = useMutation({
        mutationFn: (props: { questionId: string, data: any }) => updateQuestion(props.questionId, props.data),
        onSuccess: (data: any) => {
            console.log(data);
            const index = questions.findIndex((question: any) => question.questionId === data.updatedQuestion._id);
            const ques: Question[] = questions;
            ques[index] = data.updatedQuestion;
            setQuestions(ques)
        }
    })
    
    return (
        <>
            <Box borderWidth="1px" p={4} my={3} borderRadius="md">

            </Box>
            {questions?.map((question: Question, index: number) => (
                index >= indexOfFirstQuestion && index <= indexOfLastQuestion &&
                <Box key={question._id} borderWidth="1px" p={4} my={3} borderRadius="md"
                >
                    <HStack justifyContent={'space-between'} mb={5}>
                        <HStack w={'100%'}>
                            <Text>Q{questions.length - (index)}</Text>
                            <DelayInputField value={question?.question} onInputChange={(str) => handleQuestionChange.mutate({ questionId: question._id, data: { question: str } })} width="100%" />
                        </HStack>
                        <HStack>
                            <DelayInputField value={question?.score.toString()} onInputChange={(str) => handleQuestionChange.mutate({ questionId: question._id, data: { score: parseInt(str) } })} placeholder="Assigned Marks" />
                            <Text fontSize="xs" color="gray.500">
                                marks
                            </Text>
                        </HStack>
                    </HStack>
                    <RadioGroup
                        defaultValue={question.correct_answer}
                        my={2}
                    >
                        {question.options.map((option, index) => (
                            <Box key={index} border={'1px solid #eee'} p={2} mb={2} rounded={'base'}>
                                <Radio value={option} mr={3} checked={true} onChange={() =>
                                    handleQuestionChange.mutate({
                                        questionId: question._id,
                                        data: { correct_answer: option }
                                    })
                                }>
                                    {option}
                                </Radio>
                            </Box>
                        ))}
                    </RadioGroup>
                </Box>
            ))
            }
            <Spacer h={7} />
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(questions.length / questionsPerPage)}
                onPageChange={handlePageChange}
            />
            <Spacer h={5} />
        </>
    )
}

export default EditTestQuestionsGrid