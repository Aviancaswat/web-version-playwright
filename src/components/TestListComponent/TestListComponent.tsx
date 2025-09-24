import { useState } from "react";
import {
  Box,
  Text,
  Button,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack,
  Input,
  Circle,
  IconButton,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";

// Store
import useTestStore from "../../store/useTestStore/useTestStore";
import useEditTestStore from "../../store/useEditTestStore/useEditTestStore";
import useLoadingStore from "../../store/useLoadingStore/useLoadingStore";

//Services
import {
  checkWorkflowStatus,
  downLoadReportHTML,
  replaceDataforNewTest,
} from "../../github/api";

//Types
import type { TestResultData } from "./TestListComponent.types";
import type { Test } from "../../store/useTestStore/useTestStore.types";

const TestListComponent: React.FC = () => {
  const { tests, removeTest, clearTests, blockForm, unblockForm } =
    useTestStore();

  const { setEditTest } = useEditTestStore();

  const { setShowLoading } = useLoadingStore();

  const [testListName, setTestListName] = useState<string>("");

  const [resultData, setResultData] = useState<TestResultData | null>(null);

  const checkStatusWorkflow = async (
    commitSHA?: string
  ): Promise<TestResultData | undefined> => {
    if (!commitSHA) return;

    return new Promise<TestResultData | undefined>((resolve) => {
      const getStatus = async () => {
        const response = await checkWorkflowStatus(commitSHA);

        if (!response) return;

        const { status, result = "", title, workflowId } = response;

        if (status === "completed") {
          clearInterval(intervalId);

          resolve({
            status,
            result,
            title,
            workflowId: workflowId !== undefined ? workflowId : 0,
          });
        }
      };

      getStatus();
      const intervalId = setInterval(getStatus, 15000);
    });
  };

  const handleSubmitTest = async () => {
    if (!testListName.trim()) return;

    try {
      setShowLoading(true);
      blockForm();

      const commit = await replaceDataforNewTest(
        testListName,
        JSON.stringify(tests)
      );

      const response = (await checkStatusWorkflow(commit)) || null;

      setResultData(response);
    } catch (err) {
      console.error(err);
    } finally {
      setShowLoading(false);
    }
  };

  const handleCleanList = () => {
    clearTests();
  };

  const handleCleanAll = () => {
    clearTests();
    setTestListName("");
    setResultData(null);
    unblockForm();
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      boxShadow="md"
      w="100%"
      maxW="500px"
      position="relative"
      display="flex"
      flexDirection="column"
      h="100%"
      mt={2}
    >
      <Box p={5} flex="1 1 auto" minH={0}>
        <Text fontSize="sm" fontWeight="bold" mb={2}>
          Listado de pruebas
        </Text>

        {resultData?.status !== "completed" && (
          <Input
            placeholder="Nombre set de pruebas*"
            mb={4}
            value={testListName}
            onChange={(e) => setTestListName(e.target.value)}
          />
        )}
        {resultData?.status === "completed" && (
          <Box
            mb={4}
            display={"flex"}
            alignItems={"center"}
            w={"100%"}
            justifyContent={"space-between"}
          >
            <Text fontSize="md" fontWeight={"bold"}>
              {resultData.title}
            </Text>
            {resultData.result === "success" ? (
              <Circle size="20px" mt={2} bg="green.400" color="white">
                <CheckIcon w={3} h={3} />
              </Circle>
            ) : (
              <Circle size="20px" mt={2} bg="red.400" color="white">
                <CloseIcon w={3} h={3} />
              </Circle>
            )}
          </Box>
        )}

        {tests.length === 0 ? (
          <Text color="gray.500" minH="125px">
            No hay pruebas creadas todavía
          </Text>
        ) : (
          <Accordion allowMultiple maxH="240px" overflowY="auto">
            {tests.map((test: Test, index: number) => (
              <AccordionItem
                key={index}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                mb={2}
              >
                <h2>
                  <AccordionButton
                    _expanded={{ bg: "red.50" }}
                    _hover={{ borderColor: "#FF0000" }}
                    _focus={{ borderColor: "#FF0000", outline: "none" }}
                  >
                    <HStack justify="space-between" w="100%">
                      <Text fontWeight="bold" fontSize="sm">
                        {test.id}
                      </Text>
                      <HStack>
                        {resultData?.status !== "completed" && (
                          <IconButton
                            size="sm"
                            aria-label="Eliminar"
                            title="Eliminar"
                            icon={<DeleteIcon />}
                            colorScheme="red"
                            _hover={{ borderColor: "#FF0000" }}
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTest(index);
                            }}
                          />
                        )}
                        {resultData?.status !== "completed" && (
                          <IconButton
                            size="sm"
                            aria-label="Editar"
                            title="Editar"
                            icon={<EditIcon />}
                            colorScheme="blue"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditTest(test, index);
                            }}
                          />
                        )}
                        <AccordionIcon />
                      </HStack>
                    </HStack>
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <pre style={{ margin: 0, fontSize: "0.8rem" }}>
                    {JSON.stringify(test, null, 2)}
                  </pre>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </Box>

      <Divider />

      <Box
        w="100%"
        display="flex"
        justifyContent="space-between"
        columnGap={4}
        p={5}
        mt="auto"
      >
        {tests.length > 0 && !resultData && (
          <Button
            w="100%"
            backgroundColor="#ffffff"
            border="2px solid #1b1b1b"
            color="#1b1b1b"
            borderRadius="full"
            _hover={{
              backgroundColor: "#1b1b1b",
              color: "#ffffff",
              borderColor: "#1b1b1b",
            }}
            onClick={handleCleanList}
            isDisabled={tests.length === 0}
          >
            Limpiar lista
          </Button>
        )}
        {!resultData && (
          <Button
            w="100%"
            colorScheme="blackAlpha"
            backgroundColor="#1b1b1b"
            borderRadius="full"
            onClick={handleSubmitTest}
            isDisabled={tests.length === 0 || !testListName.trim()}
          >
            Iniciar prueba
          </Button>
        )}
        {resultData && (
          <>
            <Button
              w="100%"
              backgroundColor="#ffffff"
              border="2px solid #1b1b1b"
              color="#1b1b1b"
              borderRadius="full"
              _hover={{
                backgroundColor: "#1b1b1b",
                color: "#ffffff",
                borderColor: "#1b1b1b",
              }}
              onClick={handleCleanAll}
            >
              Reiniciar
            </Button>
            <Button
              w="100%"
              colorScheme="blackAlpha"
              backgroundColor="#1b1b1b"
              borderRadius="full"
              onClick={() => downLoadReportHTML(resultData.workflowId)}
            >
              Descargar reporte
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default TestListComponent;
