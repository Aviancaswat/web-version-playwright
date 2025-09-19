import { Button, Menu, MenuButton, MenuItem, MenuList, SkeletonText, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from "@chakra-ui/react";
import { FolderDown, GripHorizontal, ImageDown, RefreshCw } from "lucide-react";
import { useEffect, useId, useState, type ReactElement } from "react";
import { type ResultWorkflow, type StatusWorkflow } from "../../github/api";
import PaginationTableDash from "./pagination-table";
import TagDash from "./tag-dash";

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

    const [isLoading, setLoading] = useState<boolean>(false)

    const parserValueWorkflow = (value: StatusWorkflow | ResultWorkflow | undefined): ReactElement => {
        switch (value) {
            case "success":
                return <TagDash key={new Date().getTime()} type="success" />
            case "cancelled":
                return <TagDash key={new Date().getTime()} type="cancelled" />
            case "completed":
                return <TagDash key={new Date().getTime()} type="completed" />
            case "failure":
                return <TagDash key={new Date().getTime()} type="failure" />
            case "in_progress":
                return <TagDash key={new Date().getTime()} type="in_progress" />
            case "queued":
                return <TagDash key={new Date().getTime()} type="queued" />
            case "neutral":
            case undefined:
            default:
                return <TagDash key={new Date().getTime()} type="neutral" />
        }
    }

    useEffect(() => {
        setLoading(true)
        let timeOut: NodeJS.Timeout;
        timeOut = setTimeout(() => {
            setLoading(false)
        }, 3000);

        () => clearTimeout(timeOut)
    }, [])

    return (
        <>
            {
                data.map((row, index) => (
                    <Tr key={index}>
                        <Td>
                            <SkeletonText p={0} m={0} isLoaded={!isLoading} noOfLines={1} skeletonHeight={2}>
                                {row.workflowname}
                            </SkeletonText>
                        </Td>
                        <Td>
                            <SkeletonText
                                p={0}
                                m={0}
                                isLoaded={!isLoading}
                                noOfLines={1}
                                skeletonHeight={2}
                            >
                                {parserValueWorkflow(row.statusWorkflow)}
                            </SkeletonText>
                        </Td>
                        <Td>
                            <SkeletonText
                                p={0}
                                m={0}
                                isLoaded={!isLoading}
                                noOfLines={1}
                                skeletonHeight={2}
                            >
                                {parserValueWorkflow(row.resultWorkflow)}
                            </SkeletonText>
                        </Td>
                        <Td>
                            <SkeletonText
                                p={0}
                                m={0}
                                isLoaded={!isLoading}
                                noOfLines={1}
                                skeletonHeight={2}
                            >
                                {row.timeExecute}
                            </SkeletonText>
                        </Td>
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
                    </Tr >
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
            <Table size='sm' variant={"striped"} colorScheme="green" width={"100%"}>
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
                <Tfoot>
                    <Tr m={0} p={0}>
                        <Th m={0} p={0}>
                            <PaginationTableDash />
                        </Th>
                    </Tr>
                </Tfoot>
            </Table>
        </TableContainer >
    )
}

export default TableWorkflowsDash