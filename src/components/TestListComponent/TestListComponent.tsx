import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack,
} from "@chakra-ui/react";

// Store
import useTestStore from "../../store/useTestStore";
import { replaceDataforNewTest } from "../../github/api";

const TestListComponent = () => {
  const { tests, removeTest, clearTests } = useTestStore();

  const handleSubmitTest = async () => {
    try {
      await replaceDataforNewTest(JSON.stringify(tests));
    } catch (err) {
      console.error(err);
    } finally {
      clearTests();
    }
  };

  const handleCleanList = () => {
    clearTests();
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      boxShadow="md"
      p={5}
      w="100%"
      maxW="500px"
      h={"300px"}
    >
      <Text fontSize="sm" fontWeight={"bold"} mb={2}>
        Listado de pruebas
      </Text>

      {tests.length === 0 ? (
        <Text color="gray.500" h={"150px"}>
          No hay pruebas creadas todavía
        </Text>
      ) : (
        <Accordion allowMultiple h={"150px"} overflowY={"auto"}>
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
                    <Text fontWeight="bold" fontSize="sm">
                      {test.id}
                    </Text>
                    <HStack>
                      <Button
                        size="xs"
                        colorScheme="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTest(index);
                        }}
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

      <Divider my={4} />

      <Box
        w="100%"
        display={"flex"}
        justifyContent={"space-between"}
        columnGap={4}
      >
        {tests.length > 0 && (
          <Button
            w="100%"
            backgroundColor={"#ffffff"}
            border={"2px solid #1b1b1b"}
            color={"#1b1b1b"}
            borderRadius={"full"}
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
        <Button
          w="100%"
          colorScheme="blackAlpha"
          backgroundColor={"#1b1b1b"}
          borderRadius={"full"}
          onClick={handleSubmitTest}
          isDisabled={tests.length === 0}
        >
          Iniciar prueba
        </Button>
      </Box>
    </Box>
  );
};

export default TestListComponent;
