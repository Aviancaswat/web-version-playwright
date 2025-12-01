import { Box, Button, ButtonGroup, Heading, Stack, VStack } from "@chakra-ui/react";
import { Captions, ClipboardMinus, Earth, LayoutDashboard, MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import CardHome from "./CardHome";

const HomeBody = () => {
  return (
    <Stack direction={{ base: "column", lg: "row" }} height={"100vh"}>
      <VStack
        spacing={8}
        flex={1}
        width={{ base: "100%", lg: "50%" }}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Heading
          textAlign={"center"}
          fontSize={{ base: "4xl", lg: "5xl" }}
          className="animate__animated animate__fadeInUp"
        >
          Avianca <br /> Playwright
        </Heading>
        <Box>
          <Heading
            textAlign={"center"}
            fontSize={{ base: "xs", lg: "sm" }}
            fontWeight={"normal"}
          >
            <TypeAnimation
              sequence={[
                'Crea tus pruebas fácilmente',
                1000,
                'Visualiza tus resultados al instante',
                1000,
                'Descarga tus reportes con un solo clic',
                1000,
                'Hazlo todo en un solo lugar',
                1000,
              ]}
              wrapper="span"
              speed={50}
              style={{ fontSize: '2em', display: 'inline-block' }}
              repeat={Infinity}
            />
          </Heading>
        </Box>
        <Box>
          <ButtonGroup spacing={4}>
            <Button
              as={Link}
              to={"/create-test"}
              variant={"solid"}
              bg={"black"}
              color={"white"}
              _hover={{
                bg: "gray.700",
                color: "white"
              }}
            >
              Crear Test
            </Button>
            <Button
              as={Link}
              to={"/dashboard"}
              rightIcon={<MoveRight />}
              variant={"ghost"}
            >
              Dashboard
            </Button>
          </ButtonGroup>
        </Box>
      </VStack>

      <VStack pt={5} pb={5} width={{base: "100%", lg: "25%"}}>
        <CardHome
          title="Crea tus pruebas"
          description="Desarrolla escenarios de pruebas en segundos y optimiza tu flujo de trabajo"
          Icon={Captions}
          cardHeight="60%"
          buttonColor="green"
        />
        <CardHome
          title="Visualiza tus resultados al instante"
          Icon={LayoutDashboard}
          cardHeight="40%"
          buttonColor="cyan"
        />
      </VStack>
      <VStack pt={{ base: 1, lg: 5 }} pb={5} pr={{ base: 0, lg: 5 }} width={{base: "100%", lg: "25%"}}>
        <CardHome
          title="Descarga tus reportes con un solo clic"
          Icon={ClipboardMinus}
          cardHeight="40%"
          buttonColor="purple"
        />
        <CardHome
          title="Hazlo todo en un solo lugar"
          description="Desde la creación de pruebas hasta la descarga de reportes, todo en tu dashboard."
          Icon={Earth}
          cardHeight="60%"
          buttonColor="yellow"
        >
        </CardHome>
      </VStack>
    </Stack >
  );
};

export default HomeBody;
