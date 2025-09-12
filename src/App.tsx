import { Box, Button, ButtonGroup, Card, Heading, Image, Stack, Text, Textarea, useToast, VStack } from '@chakra-ui/react';
import { DownloadIcon, Github } from 'lucide-react';
import { RequestError } from 'octokit';
import { useCallback, useRef, useState } from 'react';
import './App.css';
import ImageBG from "./assets/fondo-ui.jpg";
import { checkStatusWorkflow, downLoadReportHTML, replaceDataforNewTest } from './github/api';
import { testStore } from './store/test-store';

const App = () => {

  const {setStatusWorkflow, setResultWorkflow} = testStore()
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingReport, setLoadingReport] = useState<boolean>(false)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleReplaceData = useCallback(async () => {

    try {

      setLoading(true);
      const commitResponse = await replaceDataforNewTest(textAreaRef.current?.value ?? "")
      const statusReponse = await checkStatusWorkflow(commitResponse)
      setStatusWorkflow(statusReponse?.status ?? "queued")
      toast({
        title: "Datos actualizados y ejecución del workflow exitosa",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      if (error instanceof RequestError) {
        console.error("RequestError details:", {
          status: error.status,
          cause: error.cause,
          request: error.request,
          response: error.response,
          message: error.message,
          name: error.name,
          stack: error.stack,
        });
      }

      toast({
        title: "Error al actualizar los datos o ejecutar el workflow.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Error details:", error);

    } finally {
      setLoading(false);
    }
  }, [])

  const handleDownloadReport = useCallback(async () => {
    try {
      setLoadingReport(true)
      await downLoadReportHTML()
      toast({
        title: "se ha descargado el reporte html correctamente!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setLoadingReport(false)
    }
    catch (error) {
      setLoadingReport(false)
      console.error(`Error al descargar el archivo: ${error}`)
      toast({
        title: "Error al descargar el reporte html",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }, [])

  return (
    <Card
      fontSize='xl'
      borderRadius={"lg"}
      height={"auto"}
      width={"95%"}
      maxWidth={800}
      margin={{ base: "300px auto auto auto", lg: "auto" }}
    >
      <Stack spacing={1} direction={{ base: "column", lg: "row" }} alignItems={"center"} justifyContent={"center"}>
        <Box
          height={{ base: 150, lg: "90vh" }}
          width={{ base: "100%", lg: "30%" }}
          p={0}
          borderTopRadius={"lg"}
          overflow={"hidden"}
        >
          <Image
            src={ImageBG}
            alt="Demo de pruebas con playwright"
            height={"100%"}
            width={"100%"}
            objectFit={"cover"} />
        </Box>
        <VStack
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          width={{ base: "100%", lg: "70%" }}
          spacing={6}
          p={4}>
          <Heading>
            <Text as={"span"} color={"#805AD5"}>Demo</Text> - Playwright UI
          </Heading>
          <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
            <Textarea
              ref={textAreaRef}
              placeholder={
                "Ejemplo de Entrada:\n\n" +
                JSON.stringify([{
                  id: "Mi id de prueba",
                  description: "Mi descripcion de prueba",
                  homeCiudadOrigen: "BAQ",
                  homeCiudadDestino: "BOG",
                  targetPage: "home",
                  targetMethod: "homeSeleccionarFechaLlegada"
                }], null, 2)
              }
              cols={50}
              rows={14}
              resize={"none"}
            />
          </Box>
          <ButtonGroup display={"flex"} justifyContent={"end"}>
            <Button
              onClick={handleReplaceData}
              isLoading={loading}
              loadingText='Creando Workflow...'
              rightIcon={<Github />}
              bg={"black"}
              color={"white"}
              _hover={{ bg: "" }}
            >
              Ejecutar workflow
            </Button>
            <Button
              // isDisabled={statusWorkflow}
              onClick={handleDownloadReport}
              isLoading={loadingReport}
              loadingText='Descargando reporte...'
              rightIcon={<DownloadIcon />}
              variant={"outline"}
              _hover={{ bg: "" }}
            >
              Descargar reporte
            </Button>
          </ButtonGroup>
        </VStack>
      </Stack>
    </Card>
  )
}

export default App