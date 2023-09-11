import { Box, Button, HStack, Heading, Radio, RadioGroup, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react'

type Question = {
    _id: string
    question: string
    options: string[]
    score: number
    answer?: string
}

const TestQuestionsGrid = ({ questionsList, postAnswerMutation, showNext }: { questionsList: Question[], postAnswerMutation: any, showNext: boolean }) => {
    // Assuming you have a list of questions
    var [questions, setQuestions] = useState(questionsList);

    const [randomQuestion, setRandomQuestion] = useState<Question | null>(null);

    const getRandomUnansweredQuestion = () => {
        const unansweredQuestions = questions.filter((question) => !question.answer);

        if (unansweredQuestions.length === 0) {
            setRandomQuestion(null); // No more unanswered questions
        } else {
            const randomIndex = Math.floor(Math.random() * unansweredQuestions.length);
            const selectedQuestion = unansweredQuestions[randomIndex];
            setRandomQuestion(selectedQuestion);
        }
    };

    const handleNextQuestion = () => {
        getRandomUnansweredQuestion();
    };


    const handlePostAnswer = async (data: any) => {
        try{
            await postAnswerMutation.mutate({
                questionId: data.questionId,
                answer: data.answer,
            });

        }catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        if (questionsList) {
            setQuestions(questionsList)
            if(randomQuestion === null){[
                getRandomUnansweredQuestion()
            ]}
        }
    }, [questionsList])

    return (
        randomQuestion &&
        <>
            <Box key={randomQuestion._id} borderWidth="1px" p={4} my={3} borderRadius="md"
            >
                <HStack justifyContent={'space-between'} mb={5}>
                    <Heading as="h4" fontSize="lg" mr={'10px'}>
                        {randomQuestion.question}
                    </Heading>
                    <Text fontSize="xs" color="gray.500">
                        {randomQuestion.score} marks
                    </Text>
                </HStack>
                <RadioGroup
                    value={randomQuestion.answer}
                    isDisabled={randomQuestion.answer ? true : false}
                    my={2}
                >
                    {randomQuestion.options.map((option, index) => (
                        <Box key={index} border={'1px solid #eee'} p={2} mb={2} rounded={'base'}>
                            <Radio value={option} mr={3} checked={true} onChange={() =>
                                handlePostAnswer({
                                    questionId: randomQuestion._id,
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
            {
                showNext &&
                <Button size='lg' onClick={handleNextQuestion}>Next</Button>
            }
        </>
    )
}

export default TestQuestionsGrid