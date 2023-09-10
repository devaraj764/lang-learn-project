// Pagination.tsx
import React from 'react';
import { Button, HStack } from '@chakra-ui/react'; // Chakra UI component
import { MdArrowBack, MdArrowForward } from 'react-icons/md';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <HStack>
            <Button isDisabled={currentPage === 1} leftIcon={<MdArrowBack />} onClick={() => onPageChange(currentPage - 1)}>
                Previous
            </Button>
            {pageNumbers.map((number) => (
                <Button
                    key={number}
                    isActive={number === currentPage}
                    onClick={() => onPageChange(number)}
                >
                    {number}
                </Button>
            ))}
            <Button isDisabled={currentPage >= totalPages} rightIcon={<MdArrowForward />} onClick={() => onPageChange(currentPage + 1)}>
                Next
            </Button>
        </HStack>
    );
};

export default Pagination;
