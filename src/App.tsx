import { Box, Button, ButtonGroup, Heading, useToast } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import './App.css';
import { executeWorkflow, replaceDataforNewTest } from './github';

const App = () => {

  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const handleWorkflow = useCallback(async () => {

    try {
      setLoading(true)
      await executeWorkflow();
      toast({
        title: "Workflow ejecutado.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al ejecutar el workflow:", error);
      toast({
        title: "Error al ejecutar el workflow.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [])

  const handleReplaceData = useCallback(async () => {

    try {
      setLoading(true);
      await replaceDataforNewTest(
        `
          [
            {
              id: "UnicoIDdePrueba-02092025_version4",
              description: "ruta sep",
              homeCiudadOrigen: "MDE",
              homeCiudadDestino: "BOG",
              targetPage: "home"
            },
            {
              id: "miOtroIdDePrueba-02092025_version4",
              description: "ruta sep",
              homeCiudadOrigen: "BAQ",
              homeCiudadDestino: "BOG",
              targetPage: "home"
            }
          ]
        `
      );
      toast({
        title: "Datos de prueba actualizados.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al actualizar los datos de prueba:", error);
      toast({
        title: "Error al actualizar los datos de prueba.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [])

  return (
    <Box textAlign='center' fontSize='xl' p={10}>
      <Heading>Demo de pruebas con playwright - API de github</Heading>
      <ButtonGroup mt={100}>
        <Button
          colorScheme='teal'
          onClick={handleReplaceData}
          isLoading={loading}
        >
          Reemplazar Datos de Prueba
        </Button>
        {/* <Button
          colorScheme='cyan'
          onClick={handleWorkflow}
          isLoading={loading}
        >
          Ejecutar Workflows
        </Button> */}
      </ButtonGroup>
    </Box>
  )
}

export default App