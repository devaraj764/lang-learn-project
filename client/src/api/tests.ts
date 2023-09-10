import axiosInstance from "./axiosInstance";

export const createTest = async (lang: string): Promise<string[]> => {
    const response = await axiosInstance.post('/tests/create', { lang }); 
    return response.data;
};

export const fetchTestDetails = async (lang: string) => {
    const response = await axiosInstance.get(`/tests/test-details/${lang}`); 
    return response.data;
};

export const submitTest = async (testId: string, completionTime: number) => {
    const response = await axiosInstance.post(`/tests/submit-test/${testId}`, { completionTime }); 
    return response.data;
};

export const retakeTest = async (testId: string) => {
    const response = await axiosInstance.put(`/tests/retake-test/${testId}`); 
    return response.data;
};