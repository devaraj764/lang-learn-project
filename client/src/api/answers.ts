import axiosInstance from './axiosInstance';

export const fetchAnswers = async (testId: string) => {
    const response = await axiosInstance.get(`/answers/get-answers/${testId}`); // Replace with your API endpoint
    return response.data;
};

export const postAnswer = async (testId: string, questionId: string, answer: string) => {
    const response = await axiosInstance.post(`/answers/post-answer`, {
        testId, questionId, answer
    }); // Replace with your API endpoint
    return response.data;
};