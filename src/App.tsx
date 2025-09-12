import { Box, Button, ButtonGroup, Card, Heading, HStack, Image, Stack, Text, Textarea, useToast, VStack } from '@chakra-ui/react';
import { DownloadIcon, Github } from 'lucide-react';
import { RequestError } from 'octokit';
import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import ImageBG from "./assets/fondo-ui.jpg";
import { checkWorkflowStatus, downLoadReportHTML, replaceDataforNewTest } from './github/api';
import { testStore } from './store/test-store';

const App = () => {

  const { statusWorkflow, setStatusWorkflow } = testStore()
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingReport, setLoadingReport] = useState<boolean>(false)
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const [valuesStatusWorkflow, setValuesStatusWorkflow] = useState<string[]>([])

  const checkStatusWorkflow = async (commitSHA?: string): Promise<void> => {

    if (!commitSHA) {
      setStatusWorkflow("queued")
      setValuesStatusWorkflow([...valuesStatusWorkflow, "Inicializando workflow..."])
    }

    return new Promise<void>(() => {
      const getStatus = async () => {
        console.log("fetch get status...")
        const response = await checkWorkflowStatus(commitSHA)
        console.log("Response status: ", response)

        if (!response) {
          setStatusWorkflow("queued")
          setValuesStatusWorkflow([...valuesStatusWorkflow, "Incializando workflow..."])
          return;
        }

        const { status } = response;

        if (status === "completed") {
          clearInterval(intervalId);
          console.log("Workflow completed...");
          setStatusWorkflow("completed")
          setValuesStatusWorkflow([...valuesStatusWorkflow, "Workflow Completado"])
        }
        else if (status === "in_progress") {
          setStatusWorkflow("in_progress")
          setValuesStatusWorkflow([...valuesStatusWorkflow, "En progreso..."])
        }
        console.log(`Workflow status: ${status}, se volverá a checkear en 30 segundos...`);
      };

      getStatus();
      const intervalId = setInterval(getStatus, 30000);
    });
  }

  const handleReplaceData = useCallback(async () => {

    try {

      setLoading(true);
      const commitResponse = await replaceDataforNewTest(textAreaRef.current?.value ?? "")
      await checkStatusWorkflow(commitResponse)
      toast({
        title: "Datos actualizados y ejecución del workflow exitosa",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      setLoading(false)
    } catch (error) {
      setLoading(false)
      if (error instanceof RequestError) {
        console.error("RequestError details:", {
          status: error.status,
          cause: error.cause,
          request: error.request,
          response: error.response,
          message: error.message,
          name: error.name,
          stack: error.stack,
        })
      }
      toast({
        title: "Error al actualizar los datos o ejecutar el workflow.",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
      console.error("Error details:", error);
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

  useEffect(() => {
    console.log("effect workflow change: ", statusWorkflow)
  }, [valuesStatusWorkflow])

  return (
    <Card
      fontSize='xl'
      borderRadius={"lg"}
      height={"auto"}
      width={"95%"}
      maxWidth={800}
      margin={{ base: "300px auto auto auto", lg: "auto" }}
    >
      <Stack
        spacing={1}
        direction={{ base: "column", lg: "row" }}
        alignItems={"center"}
        justifyContent={"center"}>
        <Box
          height={{ base: 150, lg: "90vh" }}
          width={{ base: "100%", lg: "10%" }}
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
          width={{ base: "100%", lg: "100%" }}
          spacing={6}
          p={4}
        >
          <Heading>
            <Text as={"span"} color={"#805AD5"}>Demo</Text> - Playwright UI
          </Heading>
          <HStack width={"100%"}>
            <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="md">
              <Textarea
                ref={textAreaRef}
                placeholder={
                  "Ejemplo de Entrada:\n\n" +
                  JSON.stringify([{
                    id: "Mi id de prueba",
                    description: "Mi descripcion de prueba",
                    homeCiudadOrigen: "BAQ",
                  }], null, 2)
                }
                cols={50}
                rows={14}
                resize={"none"}
              />
            </Box>
            <Box
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              boxShadow="md"
            >
              <Textarea
                fontWeight={"bold"}
                textAlign={"center"}
                placeholder="Aquí se mostrarán los resultados y el estado de ejecución del workflow de GitHub Actions"
                cols={50}
                rows={14}
                resize={"none"}
                value={valuesStatusWorkflow.map(e => e + "\n")}
                isReadOnly
              />
            </Box>
          </HStack>
          <ButtonGroup display={"flex"} justifyContent={"end"} width={"100%"}>
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
              isDisabled={statusWorkflow === "completed" ? false : true}
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