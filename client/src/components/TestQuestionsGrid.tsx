import { Box, HStack, Heading, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from './Pagination';

type Question = {
    _id: string
    question: string
    options: string[]
    score: number
    answer?: string
}

const TestQuestionsGrid = ({ questionsList, postAnswerMutation }: { questionsList: Question[], postAnswerMutation: any }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get('page') || '1');

    // Assuming you have a list of questions
    var questions = questionsList;
    const questionsPerPage = 5; // Adjust as needed

    // Calculate the range of questions to display
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;

    const handlePageChange = (page: number) => {
        queryParams.set('page', page.toString());
        navigate(`.?${queryParams.toString()}`);
    };


    const handlePostAnswer = async (data: any) => {
        await postAnswerMutation.mutate({
            questionId: data.questionId,
            answer: data.answer,
        });
        const ques = questions;
        ques[data.index].answer = data.answer;
        console.log(questions[data.index])
    }

    return (
        <>
            {questions?.map((question: Question, index: number) => (
                index >= indexOfFirstQuestion && index <= indexOfLastQuestion &&
                <Box key={question._id} borderWidth="1px" p={4} my={3} borderRadius="md"
                >
                    <HStack justifyContent={'space-between'} mb={5}>
                        <Heading as="h4" fontSize="lg" mr={'10px'}>
                            {question.question}
                        </Heading>
                        <Text fontSize="xs" color="gray.500">
                            {question.score} marks
                        </Text>
                    </HStack>
                    <RadioGroup
                        defaultValue={question.answer}
                        my={2}
                    >
                        {question.options.map((option, index) => (
                            <Box key={index} border={'1px solid #eee'} p={2} mb={2} rounded={'base'}>
                                <Radio value={option} mr={3} checked={true} onChange={() =>
                                    handlePostAnswer({
                                        questionId: question._id,
                                        answer: option,
                                        index
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
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(questions.length / questionsPerPage)}
                onPageChange={handlePageChange}
            />
        </>
    )
}

export default TestQuestionsGrid