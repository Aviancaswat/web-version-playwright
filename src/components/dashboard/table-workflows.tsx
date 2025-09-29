import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, ButtonGroup, Heading, HStack, Menu, MenuButton, MenuItem, MenuList, Skeleton, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tooltip, Tr, useDisclosure, useToast } from "@chakra-ui/react";
import { FileX2, FolderDown, FolderX, GripHorizontal, ImageDown, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactElement } from "react";
import { deleteAllArtefacts, deleteArtefactById, downLoadReportHTML, getRunsByRepo, runWorkflowById, type ResultWorkflow, type StatusWorkflow } from "../../github/api";
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

type typeStatusWorkflow = StatusWorkflow | ResultWorkflow | undefined;

const TableWorkflowItems: React.FC<TableWorkflowItemsProps> = ({ data }) => {

    const toast = useToast();
    const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false);
    const [isLoadingScreenshots, setIsLoadingScreenshots] = useState<boolean>(false);
    const [isLoadingRun, setIsLoadingRun] = useState<boolean>(false);
    const [isLoadingDeleteArtifacts, setIsLoadingDeleteArtifacts] = useState<boolean>(false);

    const parserValueWorkflow = (value: typeStatusWorkflow): ReactElement => {
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
            setIsLoadingReport(true)
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
        finally {
            setIsLoadingReport(false)
        }
    }

    const handleDownloadScreenshots = async (workflowId: number) => {
        console.log(`Descargando imagenes para el workflow ${workflowId}`);

        try {
            setIsLoadingScreenshots(true)
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
        finally {
            setIsLoadingScreenshots(false)
        }
    }

    const handleRunWorkflow = async (workflowId: number) => {
        console.log(`Volviendo a ejecutar el workflow ${workflowId}`);
        try {
            setIsLoadingRun(true)
            await runWorkflowById(workflowId);
            toast({
                status: "success",
                title: "Workflow ejecutado",
                description: `El workflow se está ejecutando correctamente`,
            })
        }
        catch (error) {
            console.error(`Error al ejecutar el workflow ${workflowId}:`, error);
            toast({
                status: "error",
                title: "Error",
                description: error instanceof Error ? error.message : "Ocurrió un error al ejecutar el workflow",
            })
            throw error;
        }
        finally {
            setIsLoadingRun(false)
        }
    }

    const handleDeleteArtifactsByWorkflow = async (workflowId: number) => {
        console.log(`Eliminando reportes del workflow ${workflowId}`);
        try {
            setIsLoadingDeleteArtifacts(true)
            await deleteArtefactById(workflowId);
            toast({
                status: "success",
                title: "Artefacto eliminado",
                description: "Se ha eliminado los artefactos correctamente"
            })
        } catch (error) {
            console.log(error);
            toast({
                status: "error",
                title: "Error",
                description: error instanceof Error ? error.message : "Ocurrió un error al eliminar los artefactos"
            })
            throw error;
        }
        finally {
            setIsLoadingDeleteArtifacts(false)
        }
    }

    return (
        <>
            {
                data.map((row) => (
                    <Tr key={row.id}>
                        <Td>
                            <Text maxWidth={400} noOfLines={1}>
                                {row.display_title}
                            </Text>
                        </Td>
                        <Td>{parserValueWorkflow(row.status as StatusWorkflow)}</Td>
                        <Td>{parserValueWorkflow(row.conclusion as ResultWorkflow)}</Td>
                        <Td>
                            <Menu closeOnSelect={false}>
                                <MenuButton as={Button} bg="none">
                                    <GripHorizontal />
                                </MenuButton>
                                <MenuList>
                                    <MenuItem
                                        icon={isLoadingReport ? <Spinner size="sm" /> : <FolderDown />}
                                        onClick={() => handleDownloadReport(row.id)}
                                    >Descargar Reporte</MenuItem>
                                    <MenuItem
                                        icon={isLoadingScreenshots ? <Spinner size="sm" /> : <ImageDown />}
                                        onClick={() => handleDownloadScreenshots(row.id)}
                                    >Descargar Imagenes</MenuItem>
                                    <MenuItem
                                        icon={isLoadingRun ? <Spinner size="sm" /> : <RefreshCw />}
                                        onClick={() => handleRunWorkflow(row.id)}
                                    >Volver a ejecutar workflow</MenuItem>
                                    <MenuItem
                                        icon={isLoadingDeleteArtifacts ? <Spinner size="sm" /> : <FileX2 />}
                                        onClick={() => handleDeleteArtifactsByWorkflow(row.id)}
                                    >
                                        Eliminar reportes
                                    </MenuItem>
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

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
    const { setDataWorkflows, dataWorkflows } = useTestStore()
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 3;

    const handleReloadTable = useCallback(async () => {
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

            if (JSON.stringify(newData) !== JSON.stringify(dataWorkflows)) {
                setDataWorkflows(newData);
            }
        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    }, [dataWorkflows]);

    const handleDeleteAllArtifacts = async () => {
        setIsLoadingDelete(true);
        try {
            await deleteAllArtefacts();
            toast({
                status: "success",
                title: "Artefactos eliminados",
                description: "Se han eliminado todos los artefactos correctamente"
            })
        } catch (error) {
            console.log(error);
            toast({
                status: "error",
                title: "Error",
                description: error instanceof Error ? error.message : "Ocurrió un error al eliminar los artefactos"
            })
            throw error;
        }
        finally {
            setIsLoadingDelete(false);
            onClose()
        }
    }

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

                if (JSON.stringify(newData) !== JSON.stringify(dataWorkflows)) {
                    setDataWorkflows(newData);
                }
            } catch (error) {
                console.log(error);
                throw error;
            } finally {
                setLoading(false);
            }
        };
        getWorkflows();
    }, [dataWorkflows]);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const cancelRef = useRef<HTMLButtonElement>(null);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataWorkflows.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <Box
            width={"100%"}
            mt={5}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            gap={1}
        >
            <Box
                width={"100%"}
                p={2}
                borderRadius={"md"}
                display={"flex"}
                alignItems={"center"}
            >
                <HStack m={0} p={0} justify={"space-between"} width={"100%"}>
                    <Heading marginBottom={0} width={"100%"} as="h3" size={"md"}>
                        Información general de los workflows
                    </Heading>
                    <ButtonGroup
                        width={"100%"}
                        size='sm'
                        variant='outline'
                        justifyContent={"flex-end"}
                    >
                        <Tooltip
                            label="Actualizar tabla"
                            bg={"white"}
                            color={"black"}
                            borderRadius={"md"}
                        >
                            <Button
                                onClick={handleReloadTable}
                                size={"xs"}
                                isDisabled={isLoading}
                                colorScheme="green"
                                variant={"solid"}
                            >
                                <RefreshCw size={16} />
                            </Button>
                        </Tooltip>
                        <Tooltip
                            label="Eliminar todos los artefactos"
                            bg={"white"}
                            color={"black"}
                            borderRadius={"md"}
                        >
                            <Button
                                onClick={onOpen}
                                size={"xs"}
                                isDisabled={isLoading}
                                colorScheme="green"
                                variant={"solid"}
                            >
                                <FolderX size={16} />
                            </Button>
                            <AlertDialog
                                isOpen={isOpen}
                                leastDestructiveRef={cancelRef}
                                onClose={onClose}
                            >
                                <AlertDialogOverlay>
                                    <AlertDialogContent>
                                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                            Eliminar todos los artefactos
                                        </AlertDialogHeader>
                                        <AlertDialogBody>
                                            ¿Estás seguro? Esta acción no se puede deshacer.
                                        </AlertDialogBody>
                                        <AlertDialogFooter>
                                            <Button ref={cancelRef} onClick={onClose}>
                                                Cancelar
                                            </Button>
                                            <Button
                                                colorScheme='red'
                                                onClick={handleDeleteAllArtifacts}
                                                ml={3}
                                                variant={"solid"}
                                                isLoading={isLoadingDelete}
                                                loadingText="Eliminando reportes..."
                                            >
                                                Eliminar
                                            </Button>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialogOverlay>
                            </AlertDialog>
                        </Tooltip>
                    </ButtonGroup>
                </HStack>
            </Box>
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
                    <Tbody height={100}>
                        {
                            isLoading ? (
                                [...Array(3)].map((_, index) => (
                                    <Tr key={index}>
                                        <Td>
                                            <Skeleton height="20px" />
                                        </Td>
                                        <Td>
                                            <Skeleton height="20px" />
                                        </Td>
                                        <Td>
                                            <Skeleton height="20px" />
                                        </Td>
                                        <Td>
                                            <Skeleton height="20px" />
                                        </Td>
                                    </Tr>
                                ))
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