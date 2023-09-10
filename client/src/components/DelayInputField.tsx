import React, { useState, useEffect } from 'react';
import { Input } from '@chakra-ui/react';

interface InputFieldProps {
    onInputChange: (value: string) => void;
    value: string;
    placeholder?: string;
    width?: string
}

const DelayInputField: React.FC<InputFieldProps> = ({ onInputChange, value, placeholder, width }) => {
    const [searchTerm, setSearchTerm] = useState<string>(value);
    const delay = 1000; // 1 second
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleInputChange = (newValue: string) => {
        setSearchTerm(newValue);

        // Clear the previous timeout
        clearTimeout(timeoutId);

        // Set a new timeout when the user stops typing
        timeoutId = setTimeout(() => {
            onInputChange(newValue); // Call the onInputChange callback
        }, delay);
    };

    useEffect(() => {
        // Cleanup the timeout on unmount
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <Input
            type="text"
            placeholder={placeholder || "Type here"}
            value={searchTerm}
            onChange={(e) => handleInputChange(e.target.value)}
            w={width || "fit-content"}
        />
    );
};

export default DelayInputField;
