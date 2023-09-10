import axiosInstance from './axiosInstance';


export const fetchLanguages = async (): Promise<string[]> => {
    const response = await axiosInstance.get('/questions/languages');
    return response.data.languages;
};

export const fetchLanguageDetails = async (lang: string): Promise<any> => {
    const response = await axiosInstance.get(`/questions/language-details/${lang}`);
    return response.data;
};

export const fetchQuestions = async (lang: string, testId?: string) => {
    const response = await axiosInstance.get(`/questions/get-questions/${lang}/${testId}`);
    return response.data;
};

export const updateQuestion = async (questionId: string, data?: any): Promise<any> => {
    const response = await axiosInstance.post(`/questions/update/${questionId}`, data);
    return response.data;
};