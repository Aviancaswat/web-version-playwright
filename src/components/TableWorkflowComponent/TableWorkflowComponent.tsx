import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  ButtonGroup,
  Heading,
  HStack,
  Skeleton,
  SkeletonCircle,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { FolderX, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { deleteAllArtefacts, getRunsByRepo } from "../../github/api";
import { useTestStore } from "../../store/test-store";
import PaginationTableDash from "../PaginationTableComponent/PaginationTableComponent";
import TableWorkflowItemComponent from "../TableWorkflowItemComponent/TableWorkflowItemComponent";
import type { DataWorkflows } from "./TableWorkflowComponent.types";

const TableWorkflowsDash: React.FC = () => {

  const toast = useToast();
  const { setDataWorkflows, dataWorkflows } = useTestStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 3;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataWorkflows.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);

  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const getWorkflows = async () => {
      setLoading(true);
      try {
        const runs = await getRunsByRepo();
        if (runs.length === 0) throw new Error("No hay workflows");
        console.log("Data workflows: ", runs)

        const newData: DataWorkflows[] = runs.map((workflow) => ({
          id: workflow.id,
          actor: {
            autorname: workflow?.actor?.login,
            avatar: workflow?.actor?.avatar_url,
          },
          display_title: workflow.display_title,
          status: workflow.status,
          conclusion: workflow.conclusion,
          total_count: workflow.total_count,
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

  useEffect(() => {
    const getWorkflows = async () => {
      setLoading(true);
      try {
        const runs = await getRunsByRepo();
        if (runs.length === 0) throw new Error("No hay workflows");

        const newData: DataWorkflows[] = runs.map((workflow) => ({
          id: workflow.id,
          actor: {
            autorname: workflow?.actor?.login,
            avatar: workflow?.actor?.avatar_url,
          },
          display_title: workflow.display_title,
          status: workflow.status,
          conclusion: workflow.conclusion,
          total_count: workflow.total_count,
        }));

        if (JSON.stringify(newData) !== JSON.stringify(dataWorkflows)) {
          setDataWorkflows(newData);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getWorkflows();
  }, [dataWorkflows]);

  const handleReloadTable = useCallback(async () => {
    setLoading(true);

    try {
      const runs = await getRunsByRepo();
      if (runs.length === 0) throw new Error("No hay workflows");
      const newData: DataWorkflows[] = runs.map((workflow) => ({
        id: workflow.id,
        actor: {
          autorname: workflow?.actor?.login,
          avatar: workflow?.actor?.avatar_url,
        },
        display_title: workflow.display_title,
        status: workflow.status,
        conclusion: workflow.conclusion,
        total_count: workflow.total_count,
      }));

      if (JSON.stringify(newData) !== JSON.stringify(dataWorkflows)) {
        setDataWorkflows(newData);
      }
    } catch (error) {
      console.log(error);
    } finally {
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
        description: "Se han eliminado todos los artefactos correctamente",
      });
    } catch (error) {
      toast({
        status: "error",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Ocurrió un error al eliminar los artefactos",
      });
      throw error;
    } finally {
      setIsLoadingDelete(false);
      onClose();
    }
  };

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
            size="sm"
            variant="outline"
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
                bg={"black"}
                color={"white"}
                _hover={{
                  bg: "gray",
                }}
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
                bg={"black"}
                color={"white"}
                _hover={{
                  bg: "gray",
                }}
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
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
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
                        colorScheme="red"
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
        <Table
          size="sm"
          variant={"striped"}
          colorScheme="blackAlpha"
          width={"100%"}
        >
          <Thead>
            <Tr>
              <Th>Autor</Th>
              <Th>Nombre del workflow</Th>
              <Th>Status</Th>
              <Th>Resultado</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody width={"100%"} height={100}>
            {
              isLoading ? (
                [...Array(3)].map((_, index) => (
                  <Tr key={index}>
                    <Td>
                      <SkeletonCircle height="32px" width={"32px"} />
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
                    <Td>
                      <Skeleton height="20px" />
                    </Td>
                  </Tr>
                ))
              ) : (
                currentItems.length > 0 && (
                  <TableWorkflowItemComponent data={currentItems} />
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
