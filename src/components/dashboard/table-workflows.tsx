import { Box, Button, Menu, MenuButton, MenuItem, MenuList, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useToast } from "@chakra-ui/react";
import { FolderDown, GripHorizontal, ImageDown, RefreshCw } from "lucide-react";
import { useEffect, useState, type ReactElement } from "react";
import { downLoadReportHTML, getRunsByRepo, type ResultWorkflow, type StatusWorkflow } from "../../github/api";
import { useTestStore } from "../../store/test-store";
import PaginationTableDash from "./pagination-table";
import TagDash from "./tag-dash";

export type DataWorkflows = {
    id: number,
    display_title: string,
    status: string | null,
    conclusion: string | null,
    total_count: number
}

type TableWorkflowItemsProps = {
    data: DataWorkflows[];
}

const TableWorkflowItems: React.FC<TableWorkflowItemsProps> = ({ data }) => {

    const toast = useToast();

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

    const handleDownloadReport = async (workflowId: number) => {
        console.log(`Descargando reporte para el workflow ${workflowId}`);
        try {
            await downLoadReportHTML(workflowId);
            toast({
                status: "success",
                title: "Reporte descargado",
                description: `El reporte se descargó correctamente`,
            })
        } catch (error) {
            console.error(`Error al descargar el reporte para el workflow ${workflowId}:`, error);
            toast({
                status: "error",
                title: "Error",
                description: error instanceof Error ? error.message : "Ocurrió un error al descargar el reporte",
            })
            throw error;
        }
    }

    const handleDownloadScreenshots = async (workflowId: number) => {
        console.log(`Descargando imagenes para el workflow ${workflowId}`);

        try {
            await downLoadReportHTML(workflowId, "only-screenshots");
            toast({
                status: "success",
                title: "Imagenes descargadas",
                description: `Las imagenes se descargaron correctamente`,
            })
        }
        catch (error) {
            console.error(`Error al descargar las imagenes para el workflow ${workflowId}:`, error);
            toast({
                status: "error",
                title: "Error",
                description: error instanceof Error ? error.message : "Ocurrió un error al descargar las imagenes",
            })
            throw error;
        }
    }

    return (
        <>
            {
                data.map((row) => (
                    <Tr key={row.id}>
                        <Td>{row.display_title}</Td>
                        <Td>{parserValueWorkflow(row.status as StatusWorkflow)}</Td>
                        <Td>{parserValueWorkflow(row.conclusion as ResultWorkflow)}</Td>
                        <Td>
                            <Menu closeOnSelect={false}>
                                <MenuButton as={Button} bg="none">
                                    <GripHorizontal />
                                </MenuButton>
                                <MenuList>
                                    <MenuItem
                                        icon={<FolderDown />}
                                        onClick={() => handleDownloadReport(row.id)}
                                    >Descargar Reporte</MenuItem>
                                    <MenuItem
                                        icon={<ImageDown />}
                                        onClick={() => handleDownloadScreenshots(row.id)}
                                    >Descargar Imagenes</MenuItem>
                                    <MenuItem icon={<RefreshCw />}>Volver a ejecutar workflow</MenuItem>
                                </MenuList>
                            </Menu>
                        </Td>
                    </Tr>
                ))
            }
        </>
    );
};

const TableWorkflowsDash: React.FC = () => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const { setDataWorkflows, dataWorkflows } = useTestStore()
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 3;

    useEffect(() => {
        const getWorkflows = async () => {
            setLoading(true);
            try {
                const runs = await getRunsByRepo();
                if (runs.length === 0) throw new Error("No hay workflows");

                const newData: DataWorkflows[] = runs.map(workflow => ({
                    id: workflow.id,
                    display_title: workflow.display_title,
                    status: workflow.status,
                    conclusion: workflow.conclusion,
                    total_count: workflow.total_count
                }));

                setDataWorkflows(newData);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        getWorkflows();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataWorkflows.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <Box width={"100%"} mt={5} display={"flex"} flexDirection={"column"} alignItems={"center"} gap={3}>
            <TableContainer
                p={1}
                boxShadow="0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)"
                borderRadius={"md"}
                width={"100%"}
            >
                <Table size='sm' variant={"striped"} colorScheme="green" width={"100%"}>
                    <Thead>
                        <Tr>
                            <Th>Nombre del workflow</Th>
                            <Th>Status</Th>
                            <Th>Resultado</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody width={"100%"} height={100}>
                        {
                            isLoading ? (
                                <Box
                                    width={"100%"}
                                    display={"flex"}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                    mt={5}
                                >
                                    <Text>Cargando...</Text> <Spinner ml={2} />
                                </Box>
                            ) : (
                                currentItems.length > 0 && (
                                    <TableWorkflowItems data={currentItems} />
                                )
                            )}
                    </Tbody>
                </Table>
            </TableContainer>
            <PaginationTableDash
                totalItems={dataWorkflows.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                paginate={paginate}
            />
        </Box>
    );
};

export default TableWorkflowsDash;
