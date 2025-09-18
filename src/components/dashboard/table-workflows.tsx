import { Button, Menu, MenuButton, MenuItem, MenuList, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { FolderDown, GripHorizontal, ImageDown, RefreshCw } from "lucide-react";
import { useId } from "react";
import { type ResultWorkflow, type StatusWorkflow } from "../../github/api";

type TableItems = {
    workflowname: string,
    statusWorkflow: StatusWorkflow,
    resultWorkflow: ResultWorkflow,
    timeExecute: string | number
}

type TableWorkflowItemsProps = {
    data: TableItems[]
}

const tableData: TableItems[] = [
    {
        workflowname: "Ruta de BOG-STA",
        statusWorkflow: "in_progress",
        resultWorkflow: undefined,
        timeExecute: "Por definir"
    },
    {
        workflowname: "Llenado de formulario de pasajeros",
        statusWorkflow: "queued",
        resultWorkflow: undefined,
        timeExecute: "Por definir"
    },
    {
        workflowname: "Ruta de BOG-CALI",
        statusWorkflow: "completed",
        resultWorkflow: "success",
        timeExecute: "2.50"
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
                        <Td>{row.timeExecute}</Td>
                        <Td>
                            <Menu closeOnSelect={false}>
                                <MenuButton as={Button} bg="none">
                                    <GripHorizontal />
                                </MenuButton>
                                <MenuList>
                                    <MenuItem icon={<FolderDown />}>Descargar Reporte</MenuItem>
                                    <MenuItem icon={<ImageDown />}>Descargar Imagenes</MenuItem>
                                    <MenuItem icon={<RefreshCw />}>Volver a ejecutar workflow</MenuItem>
                                </MenuList>
                            </Menu>
                        </Td>
                    </Tr>
                ))
            }
        </>
    )
}

const TableWorkflowsDash: React.FC = () => {
    return (
        <TableContainer
            p={3}
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)"
            borderRadius={"md"}
        >
            <Table size='sm' variant={"striped"} colorScheme="green">
                <Thead>
                    <Tr>
                        <Th>Nombre del workflow</Th>
                        <Th>Status</Th>
                        <Th>Resultado</Th>
                        <Th>Tiempo(min)</Th>
                        <Th>Acciones</Th>
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