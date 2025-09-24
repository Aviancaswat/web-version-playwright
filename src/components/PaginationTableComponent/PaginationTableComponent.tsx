import { Box, Button } from "@chakra-ui/react";

//Types
import type { PaginationProps } from "./PaginationTableComponent.types";

const PaginationTableDash: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  paginate,
}) => {
  const pageNumbers: any[] = [];

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const showPages = () => {
    if (totalPages <= 10) {
      return pageNumbers;
    }

    const range = [];
    const start = Math.max(currentPage - 1, 1);
    const end = Math.min(currentPage + 5, totalPages);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (start > 1) range.unshift("...");
    if (end < totalPages) range.push("...");

    return range;
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
      <Button
        onClick={() => paginate(currentPage - 1)}
        isDisabled={currentPage === 1}
        size="xs"
        m={1}
        variant="outline"
      >
        {"<"}
      </Button>

      {showPages().map((page, index) => (
        <Button
          key={index}
          onClick={() => paginate(page === "..." ? currentPage : page)}
          colorScheme={currentPage === page ? "blackAlpha" : "gray"}
          variant="solid"
          size={"xs"}
          m={1}
          isDisabled={page === "..."}
        >
          {page}
        </Button>
      ))}

      <Button
        onClick={() => paginate(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        size="xs"
        m={1}
        variant="outline"
      >
        {">"}
      </Button>
    </Box>
  );
};

export default PaginationTableDash;
