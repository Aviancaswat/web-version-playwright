import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { Github } from "lucide-react";
import ImageBG from "../../assets/fondo-ui.jpg";

import { useNavigate } from "react-router-dom";

const HomeBody = () => {
  const history = useNavigate();

  const handleRedirectToCreateWorkflow = () => {
    history("/crear-workflow");
  };

  return (
    <Card
      fontSize="xl"
      width={"95%"}
      maxHeight={450}
      height={"auto"}
      borderRadius={"lg"}
      maxWidth={500}
      margin={"auto"}
      mt={10}
    >
      <CardHeader
        minHeight={200}
        width={"100%"}
        p={0}
        borderTopRadius={"lg"}
        overflow={"hidden"}
      >
        <Image
          src={ImageBG}
          alt="Demo de pruebas con playwright"
          height={"100%"}
          width={"100%"}
          objectFit={"cover"}
        />
      </CardHeader>
      <CardBody>
        <Box>
          <Heading as="h3" size={"lg"} textAlign={"left"} mb={5}>
            Bienvenido a Playwright UI
          </Heading>
          <Text color={"gray.600"} textAlign={"left"} fontSize={"sm"}>
            Esta es una herramienta para facilitar la creación y ejecución de
            pruebas automatizadas en la app de Avianca.
          </Text>
        </Box>
        <Box mt={50}>
          <Button
            onClick={handleRedirectToCreateWorkflow}
            loadingText="Creando Workflow..."
            rightIcon={<Github />}
            colorScheme="blackAlpha"
            backgroundColor={"#1b1b1b"}
            borderRadius={"full"}
          >
            Crear prueba
          </Button>
        </Box>
      </CardBody>
    </Card>
  );
};

export default HomeBody;
