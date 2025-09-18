import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useId } from "react";
import type { ResultWorkflow, StatusWorkflow } from "../../github/api";

type TableItems = {
    workflowname: string,
    statusWorkflow: StatusWorkflow,
    resultWorkflow: ResultWorkflow
}

type TableWorkflowItemsProps = {
    data: TableItems[]
}

const tableData: TableItems[] = [
    {
        workflowname: "example 1",
        statusWorkflow: "in_progress",
        resultWorkflow: undefined
    },
    {
        workflowname: "example 2",
        statusWorkflow: "queued",
        resultWorkflow: undefined
    },
    {
        workflowname: "example 2",
        statusWorkflow: "completed",
        resultWorkflow: "success"
    }
]

const TableWorkflowItems: React.FC<TableWorkflowItemsProps> = ({ data }) => {

    const parserValueWorkflow = (value: StatusWorkflow | ResultWorkflow | undefined): string => {
        switch (value) {
            case "success":
                return "Exitoso";
            case "cancelled":
                return "Cancelado";
            case "completed":
                return "Completado";
            case "failure":
                return "Error";
            case "in_progress":
                return "En progreso";
            case "queued":
                return "En cola";
            case "neutral":
            case undefined:
            default:
                return "Por definir";
        }
    }

    return (
        <>
            {
                data.map(row => (
                    <Tr>
                        <Td>{row.workflowname}</Td>
                        <Td>{parserValueWorkflow(row.statusWorkflow)}</Td>
                        <Td>{parserValueWorkflow(row.resultWorkflow)}</Td>
                    </Tr>
                ))
            }
        </>
    )
}

const TableWorkflowsDash: React.FC = () => {
    return (
        <TableContainer>
            <Table size='sm'>
                <Thead>
                    <Tr>
                        <Th>Nombre del workflow</Th>
                        <Th>Status</Th>
                        <Th>Resultado </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <TableWorkflowItems key={useId()} data={tableData} />
                </Tbody>
            </Table>
        </TableContainer>
    )
}

export default TableWorkflowsDash