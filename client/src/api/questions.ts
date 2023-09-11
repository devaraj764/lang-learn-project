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

export const updateQuestion = async (questionId?: string, data?: any): Promise<any> => {
    var uri: string;
    if (questionId) uri = `/questions/update-question?questionId=${questionId}`;
    else uri = `/questions/update-question`;
    const response = await axiosInstance.post(uri, data);
    return response.data;
};

export const deleteQuestion = async (questionId: string): Promise<any> => {
    var uri: string = uri = `/questions/delete-question?questionId=${questionId}`;
    const response = await axiosInstance.post(uri);
    return response.data;
};