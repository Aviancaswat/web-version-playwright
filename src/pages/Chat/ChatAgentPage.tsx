import { Box, Heading, Text, Textarea } from "@chakra-ui/react";

const ChatAgentPage = () => {
    return (
        <Box height={"full"} width={"full"} display={"flex"} flexDirection={"column"}>
            <Box height={"100%"} display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                <Heading>Bienvenido a Avianca Agent</Heading>
                <Text>
                    Pregunta, analiza la información del dashboard
                </Text>
            </Box>
            <Box flex="1" />
            <Box>
                <Textarea width={"full"} minHeight={100} placeholder="Preguntar algo..." />
            </Box>
        </Box>
    )
}

export default ChatAgentPage;