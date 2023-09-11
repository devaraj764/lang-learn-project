import { Box, Button, HStack, Input, Radio, RadioGroup, Spacer, Text, useToast } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from './Pagination';
import DelayInputField from './DelayInputField';
import { useMutation } from 'react-query';
import { deleteQuestion, updateQuestion } from '../api/questions';
import { useState } from 'react'
import QuestionModal from './QuestionModal';
import { useContext } from 'react';
import { MyContext } from '../App';
import { MdDelete } from 'react-icons/md';

type Question = {
    _id: string
    question: string
    options: string[]
    score: number
    answer?: string
    correct_answer?: string
}

const EditTestQuestionsGrid = ({ questionsList, lang }: { questionsList: Question[], lang: string }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get('page') || '1');
    const toast = useToast()
    const context = useContext(MyContext)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [optionId, setOptionId] = useState<string | undefined>(undefined)

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const [newOption, setNewOption] = useState('')

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
        mutationFn: (props: { questionId?: string, data: any }) => updateQuestion(props.questionId, props.data),
        onSuccess: (data: any) => {
            console.log(data);
            const index = questions.findIndex((question: any) => question._id === data.updatedQuestion._id);
            console.log(index)
            if (data.isNew) {
                setQuestions(questions => [data.updatedQuestion, ...questions]);
                toast({
                    title: 'Success',
                    description: 'created new question',
                    status: 'success',
                    duration: 2000, // Duration for which the toast is displayed (in milliseconds)
                    isClosable: true, // Allow the user to close the toast
                });
            } else {
                const ques: Question[] = questions;
                ques[index] = data.updatedQuestion;
                setQuestions(ques)
            }
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

    const handleDelete = useMutation({
        mutationFn: (questionId: string) => deleteQuestion(questionId),
        onSuccess: (data: any) => {
            setQuestions(questions => questions.filter(question => question._id !== data._id))
            toast({
                title: 'Success',
                description: 'Deleted Question',
                status: 'success',
                duration: 2000, // Duration for which the toast is displayed (in milliseconds)
                isClosable: true, // Allow the user to close the toast
            });
        },
        onError: (error: any) => {
            console.error('Error logging in:', error);
            toast({
                title: 'Login Error',
                description: error.response.data.error,
                status: 'error',
                duration: 2000, // Duration for which the toast is displayed (in milliseconds)
                isClosable: true, // Allow the user to close the toast
            });
        }
    })

    const handleDeleteOption = (option: string, question: Question) => {
        const options = question?.options.filter(item => item !== option);
        console.log(options)
        handleQuestionChange.mutate({ questionId: question._id, data: { options } })
    }

    const handleAddOption = (option: string, question: Question) => {
        const options = [...question?.options, option];
        console.log(options)
        handleQuestionChange.mutate({ questionId: question._id, data: { options } });
        setNewOption('');
        setOptionId('')
    }

    return (
        <>
            <Button borderWidth="1px" p={4} my={3} borderRadius="md" onClick={openModal}>
                Create new Question
            </Button>
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
                                <HStack justifyContent={'space-between'}>
                                    <Radio value={option} mr={3} checked={true} onChange={() =>
                                        handleQuestionChange.mutate({
                                            questionId: question._id,
                                            data: { correct_answer: option }
                                        })
                                    }>
                                        {option}
                                    </Radio>
                                    {
                                        context?.user.role === 'admin' &&
                                        <Button variant="outline" size={'sm'} colorScheme='red' onClick={() => handleDeleteOption(option, question)}><MdDelete /></Button>
                                    }
                                </HStack>
                            </Box>
                        ))}
                    </RadioGroup>
                    <HStack mt={3} justifyContent={'space-between'}>
                        <Button size={'sm'} colorScheme='red' onClick={() => handleDelete.mutate(question._id)}>Delete Question</Button>
                        {
                            optionId !== question._id &&
                            <Button size={'sm'} variant="outline" colorScheme='linkedin' onClick={() => setOptionId(question._id)}>Add Option</Button>
                        }
                    </HStack>
                    {
                        optionId === question._id &&
                        <HStack mt={3} justifyContent={'space-between'}>
                            <Input type='text' value={newOption} onChange={(e: any) => setNewOption(e.target.value)} placeholder="Enter new option" />
                            <Button size='sm' variant="outline" colorScheme='linkedin' onClick={() => handleAddOption(newOption, question)}>Add Option</Button>
                        </HStack>
                    }
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
            <QuestionModal lang={lang} isOpen={isModalOpen} onClose={closeModal} createQuestion={handleQuestionChange} />
        </>
    )
}


export default EditTestQuestionsGrid