import { useState } from 'react';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
} from '@chakra-ui/react';
// import { Form } from 'react-hook-form';

function QuestionModal({ lang, isOpen, onClose, createQuestion }: { lang?: string, isOpen: boolean, onClose: () => void, createQuestion: any }) {
    const [question, setQuestion] = useState('');
    const [language, setLanguage] = useState(lang);
    const [options, setOptions] = useState(['']);
    const [score, setScore] = useState(0);

    const handleAddOption = () => {
        setOptions([...options, '']);
    };

    const handleOptionChange = (index: number, value: any) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const newQuestion = {
            language,
            question,
            options,
            correct_answer: options[0],
            score: score,
        }
        createQuestion.mutate({ data: newQuestion });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <form onSubmit={handleSubmit}>
                    {
                        lang ?
                            <ModalHeader>Add a Question</ModalHeader>
                            :
                            <ModalHeader>Add a Language</ModalHeader>
                    }
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Language</FormLabel>
                            <Input
                                type="text"
                                defaultValue={lang || ''}
                                isDisabled={lang ? true : false}
                                onChange={(e) => setLanguage(e.target.value)}
                                textTransform={'lowercase'}
                                isRequired={true}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Question</FormLabel>
                            <Input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                isRequired={true}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Options</FormLabel>
                            {options.map((option, index) => (
                                <Input
                                    key={index}
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    mt={2}
                                    isRequired={true}
                                />
                            ))}
                            <Button size="sm" onClick={handleAddOption} mt={2}>
                                Add Option
                            </Button>
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Score</FormLabel>
                            <Input
                                type="number"
                                value={score}
                                onChange={(e) => setScore(Number(e.target.value))}
                                isRequired={true}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button type='submit' colorScheme="blue" isLoading={createQuestion.isLoading}>
                            Submit
                        </Button>
                        <Button onClick={onClose} ml={4}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
}

export default QuestionModal;
