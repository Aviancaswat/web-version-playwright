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
} from "@chakra-ui/react";

// Store
import useTestStore from "../../store/useTestStore";

//Services
import {
  checkWorkflowStatus,
  downLoadReportHTML,
  replaceDataforNewTest,
} from "../../github/api";

//Components
import SpinnerComponent from "../SpinnerComponent/SpinnerComponent";

//TODO: Agregar boton de editar prueba

const TestListComponent: React.FC = () => {
  const { tests, removeTest, clearTests } = useTestStore();

  const [testListName, setTestListName] = useState<string>("");

  const [workflowId, setWorkflowId] = useState<number | null>(null);

  const [showSpinner, setShowSpinner] = useState<boolean>(false);

  const checkStatusWorkflow = async (
    commitSHA?: string
  ): Promise<number | undefined> => {
    if (!commitSHA) return;

    return new Promise<number | undefined>((resolve) => {
      const getStatus = async () => {
        const response = await checkWorkflowStatus(commitSHA);

        if (!response) return;

        const { status, workflowId } = response;

        if (status === "completed") {
          clearInterval(intervalId);

          resolve(workflowId);
        }
      };

      getStatus();
      const intervalId = setInterval(getStatus, 15000);
    });
  };

  const handleSubmitTest = async () => {
    if (!testListName.trim()) return;

    try {
      setShowSpinner(true);
      const commit = await replaceDataforNewTest(
        testListName,
        JSON.stringify(tests)
      );

      const response = (await checkStatusWorkflow(commit)) || null;

      setWorkflowId(response);
    } catch (err) {
      console.error(err);
    } finally {
      setShowSpinner(false);
    }
  };

  const handleCleanList = () => {
    clearTests();
  };

  const handleCleanAll = () => {
    clearTests();
    setTestListName("");
    setWorkflowId(null);
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      boxShadow="md"
      w="100%"
      maxW="500px"
      position="relative"
      mt={2}
      display="flex"
      flexDirection="column"
      h="full"
    >
      <SpinnerComponent showSpinner={showSpinner} />
      {/* Contenido que crece */}
      <Box p={5} flex="1 1 auto" minH="0">
        <Text fontSize="sm" fontWeight="bold" mb={2}>Listado de pruebas</Text>
        <Input
          placeholder="Nombre set de pruebas*"
          mb={4}
          value={testListName}
          onChange={(e) => setTestListName(e.target.value)}
        />

        {tests.length === 0 ? (
          <Text color="gray.500" minH="220px">No hay pruebas creadas todavía</Text>
        ) : (
          // Si quieres evitar “saltos”, usa maxH + overflow en vez de h fija
          <Accordion allowMultiple maxH="220px" overflowY="auto">
            {tests.map((test, index) => (
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
                      <Text fontWeight="bold" fontSize="sm">{test.id}</Text>
                      <HStack>
                        <Button
                          size="xs"
                          colorScheme="red"
                          onClick={(e) => { e.stopPropagation(); removeTest(index); }}
                        >
                          Eliminar
                        </Button>
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

      {/* Footer pegado abajo */}
      <HStack p={5} spacing={4} mt="auto">
        {tests.length > 0 && !workflowId && (
          <Button
            w="100%"
            backgroundColor="#ffffff"
            border="2px solid #1b1b1b"
            color="#1b1b1b"
            borderRadius="full"
            _hover={{ backgroundColor: "#1b1b1b", color: "#ffffff", borderColor: "#1b1b1b" }}
            onClick={handleCleanList}
            isDisabled={tests.length === 0}
          >
            Limpiar lista
          </Button>
        )}
        {!workflowId && (
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
        {workflowId && (
          <>
            <Button
              w="100%"
              backgroundColor="#ffffff"
              border="2px solid #1b1b1b"
              color="#1b1b1b"
              borderRadius="full"
              _hover={{ backgroundColor: "#1b1b1b", color: "#ffffff", borderColor: "#1b1b1b" }}
              onClick={handleCleanAll}
            >
              Reiniciar
            </Button>
            <Button
              w="100%"
              colorScheme="blackAlpha"
              backgroundColor="#1b1b1b"
              borderRadius="full"
              onClick={() => downLoadReportHTML(workflowId)}
            >
              Descargar reporte
            </Button>
          </>
        )}
      </HStack>
    </Box>

  );
};

export default TestListComponent;
