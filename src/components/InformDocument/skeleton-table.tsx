import { Heading, Skeleton, SkeletonText, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

const SkeletonTable = () => {
    return (
        <>
            <SkeletonText mt={10} noOfLines={1} skeletonHeight={5}>
                <Heading marginBottom={0} width={"100%"} as="h3" size={"md"}>
                    Información general de los workflows
                </Heading>
            </SkeletonText>

            <TableContainer
                mt={2}
                p={1}
                boxShadow="0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)"
                borderRadius={"md"}
                width={"100%"}
            >
                <Table size="sm" variant={"striped"} width={"100%"}>
                    <Thead>
                        <Tr>
                            <Th><Skeleton height="20px" width="150px" /></Th>
                            <Th><Skeleton height="20px" width="100px" /></Th>
                            <Th><Skeleton height="20px" width="100px" /></Th>
                            <Th><Skeleton height="20px" width="100px" /></Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        {[...Array(3)].map((_, rowIndex) => (
                            <Tr key={rowIndex}>
                                <Td>
                                    <Skeleton height="35px" width="150px" />
                                </Td>
                                <Td>
                                    <Skeleton height="35px" width="100px" />
                                </Td>
                                <Td>
                                    <Skeleton height="35px" width="100px" />
                                </Td>
                                <Td>
                                    <Skeleton height="35px" width="100px" />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    );
};

export default SkeletonTable;
