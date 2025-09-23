import {
  Box,
  Button,
  Card,
  CardBody,
  Heading,
  Image,
  Text,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import ImageBG from "../../assets/avianca-img.png";
import checkIcon from "../../assets/ico-check.png";
import shareIcon from "../../assets/ico-share.png";
import navigateIcon from "../../assets/ico-navigate.png";
import logoAvianca from "../../assets/logo-avianca.jpeg";

import { useNavigate } from "react-router-dom";

const HomeBody = () => {
  const history = useNavigate();

  const handleRedirectToCreateWorkflow = () => {
    history("/crear-workflow");
  };

  return (
    <Box
      as="section"
      minH="calc(100vh - 63px)"             
      display="flex"
      flexDirection="column"
      justifyContent="center"  
      alignItems="center"
    >
      <Card
        fontSize="xl"
        w="95%"
        h={{ base: "auto", md: 300, lg: 240 }}
        borderRadius="lg"
        maxWidth={1000}
        mx="auto"
        mt={10}
        backgroundColor="#ff0000"
        color="white"
        overflow="hidden"
      >
        <Flex direction={{ base: "column", md: "row" }} h="100%">

          <Box
            flex={{ base: "unset", md: "0.6" }}
            w={{ base: "100%", md: "auto" }}
            h={{ base: 180, md: "100%" }}
            overflow="hidden"
            borderTopRadius={{ base: "lg", md: "0" }}
            borderLeftRadius={{ base: "0", md: "lg" }}
          >
            <Image
              src={ImageBG}
              alt="Demo de pruebas con playwright"
              w="100%"
              h="100%"
              objectFit="cover"
              objectPosition={{ base: "0px 0px", lg: "0px -38px" }}
              loading="lazy"
              draggable={false}
            />
          </Box>


          <CardBody flex={{ base: "unset", md: "0.4" }} h={{ base: "auto", md: "100%" }} display="flex" alignItems="center" position="relative">
            <Box>
              <Heading as="h3" size="md" textAlign="left" mb={5} mt={5}>
                Pruebas Automatizadas
              </Heading>
              <Image src={logoAvianca} alt="Logo Avianca" width="45px" height="55px" mb={5} position="absolute" top="28px" right="20px" />
              <Text textAlign="left" fontSize="sm">
                Esta plataforma te permite ejecutar pruebas automatizadas de los principales flujos digitales de Avianca. Selecciona un escenario, inicia la prueba y revisa los resultados de forma clara y rápida.
              </Text>
              {/* Botón alineado a la derecha */}
              <Flex mt={26} justifyContent="flex-end">
                <Button
                  size="sm"
                  onClick={handleRedirectToCreateWorkflow}
                  loadingText="Creando Workflow..."
                  backgroundColor="white"
                  color="black"
                  borderRadius="full"
                  _hover={{ backgroundColor: "black", color: "white", borderColor: "transparent" }}
                  _focus={{ boxShadow: "none" }}
                  _focusVisible={{ boxShadow: "none" }}
                >
                  Crear prueba
                </Button>
              </Flex>

            </Box>
          </CardBody>
        </Flex>
      </Card>

      <SimpleGrid
        columns={{ base: 1, md: 3 }}
        spacing={10}
        maxW="1000px"
        margin="30px auto"
      >
        {/* Item 1 */}
        <Box textAlign="center" p={4}>
          <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
            <Image
              src={navigateIcon}
              alt="Reservas"
              width="40px"
            />
          </Box>
          <Heading as="h4" fontSize="lg" mb={2} color="#1b1b1b">
            Probar procesos claves
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Validando flujos principales en páginas como Home, Booking, Services, Passengers y Payment.
          </Text>
        </Box>

        {/* Item 2 */}
        <Box textAlign="center" p={4}>
          <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
            <Image
              src={checkIcon}
              alt="Errores manuales"
              width="40px"
            />
          </Box>
          
          <Heading as="h4" fontSize="lg" mb={2} color="#1b1b1b">
            Reducir errores manuales
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Con resultados consistentes que garantizan mayor calidad y confianza en los procesos.
          </Text>
        </Box>

        {/* Item 3 */}
        <Box textAlign="center" p={4}>
          <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
            <Image
              src={shareIcon}
              alt="Reportes claros"
              width="35px"
            />
          </Box>
          <Heading as="h4" fontSize="lg" mb={2} color="#1b1b1b">
            Compartir reportes
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Claros y accesibles con tu equipo, de forma rápida y sencilla para mejorar la colaboración.
          </Text>
        </Box>
      </SimpleGrid>

    </Box>
  );
};

export default HomeBody;
