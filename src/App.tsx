import { Box, Button, Card, CardBody, CardHeader, Heading, Image, Text, Tooltip, useToast } from '@chakra-ui/react';
import { Github } from 'lucide-react';
import { useCallback, useState } from 'react';
import './App.css';
import ImageBG from "./assets/fondo-ui.jpg";
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
              id: "UnicoIDdePrueba-03092025_demo_equipo",
              description: "ruta 1",
              homeCiudadOrigen: "BAQ",
              homeCiudadDestino: "BOG",
              targetPage: "home",
              targetMethod: "homeSeleccionarFechaLlegada"
            },
            {
              id: "miOtroIdDePrueba-03092025_demo_equipo",
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
    <Card
      fontSize='xl'
      width={"95%"}
      maxHeight={450}
      height={"auto"}
      borderRadius={"lg"}
      maxWidth={500}
      margin={"auto"}
    >
      <CardHeader minHeight={200} width={"100%"} p={0} borderTopRadius={"lg"} overflow={"hidden"}>
        <Image
          src={ImageBG}
          alt="Demo de pruebas con playwright"
          height={"100%"}
          width={"100%"}
          objectFit={"cover"} />

      </CardHeader>
      <CardBody>
        <Box>
          <Heading as="h3" size={"lg"} textAlign={"left"} mb={5}>
            Bienvenido a Playwright UI
          </Heading>
          <Text color={"gray.600"} textAlign={"left"} fontSize={"sm"}>
            Esta es una herramienta para facilitar la creación y
            ejecución de pruebas automatizadas en la app de Avianca.
          </Text>
        </Box>
        <Box mt={50}>
          <Tooltip 
            label="Remplaza el dataTest y crear un nuevo workflow"
            bg={"white"}
            color={"black"}
            borderRadius={"lg"}
            p={2}
            textAlign={"center"}
            placement='left'
            >
            <Button
              onClick={handleReplaceData}
              isLoading={loading}
              loadingText='Creando Workflow...'
              rightIcon={<Github />}
              bg={"black"}
              color={"white"}
              _hover={{ bg: "#00000095", color: "white" }}
            >
              Crear Workflow
            </Button>
          </Tooltip>
        </Box>
      </CardBody>
    </Card>
  )
}

export default App