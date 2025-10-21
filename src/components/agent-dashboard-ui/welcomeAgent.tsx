import { Box, Card, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { Cable, CircleX, LayoutDashboard, Users } from "lucide-react";

const WelcomeAgentDashbaord = () => {
    return (
        <Box
            height={"100%"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
        >
            <Heading size={"2xl"}>Bienvenido a Avianca Agent</Heading>
            <Text>
                Consulta y analiza los datos del dashboard
            </Text>
            <HStack
                gap={3}
                flexWrap={"wrap"}
                width={{ base: "full", lg: "80%" }}
                mt={10}
                display={"grid"}
                placeContent={"center"}
            >
                <Stack width={"full"} direction={{ base: "column", lg: "row" }} gap={5}>
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
                    <Card width={{ base: "100%", lg: "100%" }} borderRadius={"md"} display={"flex"} flexDirection={"row"} gap={3} alignItems={"center"}>
                        <Box p={5} bg={"green.200"} color={"green.600"} borderLeftRadius={"md"}>
                            <Users />
                        </Box>
                        <Box pr={5}>
                            <Heading size={"sm"}>Dame el top users</Heading>
                        </Box>
                    </Card>
                </Stack>
                <Stack width={"full"} direction={{ base: "column", lg: "row" }} gap={5}>
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
                    <Card width={{ base: "100%", lg: "100%" }} borderRadius={"md"} display={"flex"} flexDirection={"row"} gap={3} alignItems={"center"}>
                        <Box p={5} bg={"pink.200"} color={"pink.600"} borderLeftRadius={"md"}>
                            <Cable />
                        </Box>
                        <Box pr={5}>
                            <Heading size={"sm"}>
                                Total de ejecuciones exitosas y fallidas
                            </Heading>
                        </Box>
                    </Card>
                </Stack>
            </HStack>
        </Box>
    )
}

export default WelcomeAgentDashbaord; 