import { Container, HStack, Heading,  Tag, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import NavBar from '../components/Navbar'
import { useParams } from 'react-router-dom'
import { useMutation } from 'react-query'
import { fetchQuestions } from '../api/questions'
import EditTestQuestionsGrid from '../components/EditTestQuestionsGrid'

type Question = {
    _id: string
    question: string
    options: string[]
    score: number
    answer?: string
}

// count

// function countQuestionsWithAnswers(questions: Question[]): number {
//     return questions.reduce((count: number, question: Question) => {
//         if (question.answer) {
//             return count + 1;
//         }
//         return count;
//     }, 0);
// }

const TestEditPage: React.FC = () => {
    const { lang } = useParams<{ lang: string }>();
    // const navigate = useNavigate();
    // const toast = useToast();
    const [questions, setQuestions] = useState<Question[]>([]);

    const { mutate: questionsMutate, isLoading: questionsLoading } = useMutation({
        mutationFn: (data: { lang: string }) => fetchQuestions(data.lang),
        onSuccess: (data) => {
            setQuestions(data)
        }
    });

    useEffect(() => {
        if (lang) questionsMutate({ lang })
    }, [lang])


    return (
        <VStack>
            <NavBar />
            <Container maxW='container.xl' p={2}>
                <HStack justifyContent={'space-between'} w={'full'} flexWrap={'wrap'}>
                    <div>
                        <Heading as="h2" my={4} color={'teal'} textTransform={'capitalize'}>
                            {lang} Language Test
                        </Heading>
                    </div>
                </HStack>
                
                {
                    questionsLoading ? <Tag size={'lg'}>Loading..</Tag> :
                        <EditTestQuestionsGrid questionsList={questions} />
                }
            </Container>
        </VStack >
    )
}

export default TestEditPage