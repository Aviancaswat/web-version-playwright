import { Box, Button, ButtonGroup, Heading, useToast } from '@chakra-ui/react';
import { Github } from 'lucide-react';
import { useCallback, useState } from 'react';
import './App.css';
import { replaceDataforNewTest } from './github/api';

const App = () => {

  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const handleReplaceData = useCallback(async () => {

    try {
      setLoading(true);
      await replaceDataforNewTest(
        `
          [
            {
              id: "UnicoIDdePrueba-03092025_version3",
              description: "ruta 1",
              homeCiudadOrigen: "BAQ",
              homeCiudadDestino: "BOG",
              targetPage: "home",
              targetMethod: "homeSeleccionarFechaLlegada"
            },
            {
              id: "miOtroIdDePrueba-03092025_version3",
              description: "ruta 2",
              homeCiudadOrigen: "MDE",
              homeCiudadDestino: "BOG",
              targetPage: "home",
              targetMethod: "homeSeleccionarDestino"
            }
          ]
        `
      );
      toast({
        title: "Datos actualizados y ejecución del workflow exitosa",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al actualizar los datos de prueba:", error);
      toast({
        title: "Error al actualizar los datos o ejecutar el workflow.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [])

  return (
    <Box
      textAlign='center'
      fontSize='xl'
      bg={"blue.200"}
      width={"100%"}
      height={450}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDirection={"column"}
      p={10}
      borderRadius={"lg"}
    >
      <Heading>Demo de pruebas con playwright</Heading>
      <ButtonGroup mt={100}>
        <Button
          onClick={handleReplaceData}
          isLoading={loading}
          rightIcon={<Github />}
          bg={"black"}
          color={"white"}
          _hover={{ bg: "white", color: "black" }}
        >
          Reemplazar y correr workflow
        </Button>
      </ButtonGroup>
    </Box>
  )
}

export default App