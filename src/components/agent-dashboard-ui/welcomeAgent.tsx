import { Box, Card, Center, Heading, HStack, Image, Stack, Text } from "@chakra-ui/react";
import { Cable, CircleX, LayoutDashboard, Users } from "lucide-react";
import LogoAv from "../../assets/avianca-logo-desk.png";
import ScaleAnimationBox from "../transitions/ScaleBox";
import PulsingBox from "./PulseBox";

interface Props {
    isLoading: boolean
}

const WelcomeAgentDashboard: React.FC<Props> = ({ isLoading }) => {
    return (
        <>
            {
                isLoading ? (
                    <Center height={"100%"} display={"flex"} flexDirection={"column"}>
                        <PulsingBox />
                        <Heading mt={5} size={"md"}>Avianca Playwright Agent</Heading>
                    </Center>
                ) : (
                     <Box
                height={"100%"}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <Box bg={"black"} color={"white"} borderRadius={"2xl"} mb={3}>
                    <Image src={LogoAv} alt="Avianca Logo" height={16} width={16} />
                </Box>
                <Heading size={"xl"} textAlign={"center"}>Bienvenido a <br />Avianca Playwright Agent</Heading>
                <Text>
                    Consulta y analiza los datos del dashboard
                </Text>
                <Box>
                    <Heading size={"md"} mt={5}>
                        Algunas preguntas que puedes hacerme:
                    </Heading>
                </Box>
                <HStack
                    gap={3}
                    flexWrap={"wrap"}
                    width={{ base: "full", lg: "80%" }}
                    mt={10}
                    display={"grid"}
                    placeContent={"center"}
                >
                    <Stack width={"full"} direction={{ base: "column", lg: "row" }} gap={5}>
                        <ScaleAnimationBox width={{ base: "100%", lg: "50%" }}>
                            <Card
                                width={{ base: "100%", lg: "100%" }}
                                borderRadius={"md"}
                                display={"flex"}
                                flexDirection={"row"}
                                gap={3}
                                alignItems={"center"}
                            >
                                <Box
                                    p={5}
                                    bg={"orange.200"}
                                    color={"orange.600"}
                                    borderLeftRadius={"md"}
                                >
                                    <LayoutDashboard />
                                </Box>
                                <Box pr={5}>
                                    <Heading size={"sm"}>Analiza los resultados del dashboard</Heading>
                                </Box>
                            </Card>
                        </ScaleAnimationBox>
                        <ScaleAnimationBox width={{ base: "100%", lg: "50%" }}>
                            <Card width={{ base: "100%", lg: "100%" }} borderRadius={"md"} display={"flex"} flexDirection={"row"} gap={3} alignItems={"center"}>
                                <Box p={5} bg={"green.200"} color={"green.600"} borderLeftRadius={"md"}>
                                    <Users />
                                </Box>
                                <Box pr={5}>
                                    <Heading size={"sm"}>Dame el top users</Heading>
                                </Box>
                            </Card>
                        </ScaleAnimationBox>
                    </Stack>
                    <Stack width={"full"} direction={{ base: "column", lg: "row" }} gap={5}>
                        <ScaleAnimationBox width={{ base: "100%", lg: "50%" }}>
                            <Card width={{ base: "100%", lg: "100%" }} borderRadius={"md"} display={"flex"} flexDirection={"row"} gap={3} alignItems={"center"}>
                                <Box p={5} bg={"purple.200"} color={"purple.600"} borderLeftRadius={"md"}>
                                    <CircleX />
                                </Box>
                                <Box pr={5}>
                                    <Heading size={"sm"}>
                                        Dame las 5 ejecuciones recientemente fallidas
                                    </Heading>
                                </Box>
                            </Card>
                        </ScaleAnimationBox>
                        <ScaleAnimationBox width={{ base: "100%", lg: "50%" }}>
                            <Card width={{ base: "100%", lg: "100%" }} borderRadius={"md"} display={"flex"} flexDirection={"row"} gap={3} alignItems={"center"}>
                                <Box p={5} bg={"cyan.200"} color={"cyan.600"} borderLeftRadius={"md"}>
                                    <Cable />
                                </Box>
                                <Box pr={5}>
                                    <Heading size={"sm"}>
                                        Total de ejecuciones exitosas y fallidas
                                    </Heading>
                                </Box>
                            </Card>
                        </ScaleAnimationBox>
                    </Stack>
                </HStack>
            </Box>
                )
            }
           
        </>

    )
}

export default WelcomeAgentDashboard; 