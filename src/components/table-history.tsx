import { Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

const TableHistoryWorkflows = () => {
    return (
        <TableContainer>
            <Table variant='simple'>
                <TableCaption>Avianca Playwright UI</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Nombre del workflow</Th>
                        <Th>Estado del workflow</Th>
                        <Th>Resultado del workflow</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>Commit de prueba</Td>
                        <Td>En progreso...</Td>
                        <Td>Por definir</Td>
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>
    )
}

export default TableHistoryWorkflows;