import { Box, Button } from "@chakra-ui/react";

type PaginationProps = {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    paginate: (pageNumber: number) => void;
};

const PaginationTableDash: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, currentPage, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <Box display="flex" float={"left"}>
            {pageNumbers.map(number => (
                <Button
                    key={number}
                    onClick={() => paginate(number)}
                    colorScheme={currentPage === number ? "green" : "gray"}
                    variant="solid"
                    size={"xs"}
                    m={1}
                >
                    {number}
                </Button>
            ))}
        </Box>
    );
};

export default PaginationTableDash;