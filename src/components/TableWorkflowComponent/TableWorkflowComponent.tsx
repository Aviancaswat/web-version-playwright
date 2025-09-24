import {
  Box,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

//Services
import { getRunsByRepo } from "../../github/api";

//Store
import { useTestStore } from "../../store/test-store";

//Components
import PaginationTableDash from "../PaginationTableComponent/PaginationTableComponent";
import TableWorkflowItemComponent from "../TableWorkflowItemComponent/TableWorkflowItemComponent";

//Types
import type { DataWorkflows } from "./TableWorkflowComponent.types";

const TableWorkflowsDash: React.FC = () => {
  const { setDataWorkflows, dataWorkflows } = useTestStore();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 3;

  useEffect(() => {
    const getWorkflows = async () => {
      setLoading(true);
      try {
        const runs = await getRunsByRepo();
        if (runs.length === 0) throw new Error("No hay workflows");

        const newData: DataWorkflows[] = runs.map((workflow) => ({
          id: workflow.id,
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = dataWorkflows.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Box
      width={"100%"}
      mt={5}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={3}
    >
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
              <Th>Nombre del workflow</Th>
              <Th>Status</Th>
              <Th>Resultado</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody width={"100%"} height={100}>
            {isLoading ? (
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
