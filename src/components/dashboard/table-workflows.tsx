import { Box, Button, Menu, MenuButton, MenuItem, MenuList, Spinner, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr } from "@chakra-ui/react";
import { FolderDown, GripHorizontal, ImageDown, RefreshCw } from "lucide-react";
import { useEffect, useState, type ReactElement } from "react";
import { getRunsByRepo, type ResultWorkflow, type StatusWorkflow } from "../../github/api";
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
                const { workflow_runs, total_count } = await getRunsByRepo();
                if (total_count === 0) throw new Error("No hay workflows");

                const newData: DataWorkflows[] = workflow_runs.map(workflow => ({
                    id: workflow.id,
                    display_title: workflow.display_title,
                    status: workflow.status,
                    conclusion: workflow.conclusion,
                    total_count: total_count
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
        <TableContainer
            p={1}
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)"
            borderRadius={"md"}
            width={"100%"}
            position="relative"
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
                <Tbody width={"100%"} height={100} position="relative">
                    {
                        isLoading ? (
                            <Box
                                width={"100%"}
                                display={"flex"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                position={"absolute"}
                                top={0}
                                left={0}
                                right={0}
                                bottom={0}
                                zIndex={1}
                            >
                                <Spinner
                                    thickness='4px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    color='green.500'
                                    size='xl'
                                />
                            </Box>
                        ) : (
                            currentItems.length > 0 && (
                                <TableWorkflowItems data={currentItems} />
                            )
                        )}
                </Tbody>
                <Tfoot>
                    <Tr m={0} p={0}>
                        <Th m={0} p={0}>
                            <PaginationTableDash
                                totalItems={dataWorkflows.length}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                paginate={paginate}
                            />
                        </Th>
                    </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
    );
};

export default TableWorkflowsDash;
