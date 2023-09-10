import axiosInstance from "./axiosInstance";


export const verifyUser = async (): Promise<string[]> => {
    const response = await axiosInstance.get('/auth/profile',); // Replace with your API URL
    return response.data;
};