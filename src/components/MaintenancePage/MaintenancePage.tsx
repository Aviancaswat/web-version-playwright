import { Box, Heading, Icon, Text, useColorMode, VStack } from "@chakra-ui/react";
import { Zap } from "lucide-react";

export const MaintenancePage = () => {
    const { colorMode } = useColorMode();

    return (
        <Box
            w="100%"
            h="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={colorMode === "dark" ? "gray.900" : "gray.50"}
            position="relative"
            overflow="hidden"
        >
            {/* Animated background elements */}
            <Box
                position="absolute"
                top="10%"
                left="10%"
                w="300px"
                h="300px"
                borderRadius="full"
                bg="blue.400"
                opacity="0.1"
                filter="blur(60px)"
                animation="float 6s ease-in-out infinite"
            />
            <Box
                position="absolute"
                bottom="10%"
                right="10%"
                w="300px"
                h="300px"
                borderRadius="full"
                bg="purple.400"
                opacity="0.1"
                filter="blur(60px)"
                animation="float 8s ease-in-out infinite"
            />

            <VStack
                spacing={6}
                textAlign="center"
                zIndex={1}
                px={{ base: 4, md: 8 }}
            >
                {/* Icon */}
                <Box
                    p={6}
                    borderRadius="xl"
                    bg={colorMode === "dark" ? "gray.800" : "white"}
                    boxShadow={colorMode === "dark" ? "0 4px 20px rgba(0, 0, 0, 0.5)" : "0 4px 20px rgba(0, 0, 0, 0.1)"}
                    animation="pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                >
                    <Icon as={Zap} w={12} h={12} color="blue.500" />
                </Box>

                {/* Heading */}
                <Heading
                    as="h1"
                    size="2xl"
                    color={colorMode === "dark" ? "white" : "gray.900"}
                    fontWeight="bold"
                >
                    En Mantenimiento
                </Heading>

                {/* Description */}
                <Text
                    fontSize="lg"
                    color={colorMode === "dark" ? "gray.400" : "gray.600"}
                    maxW="md"
                >
                    Estamos realizando mejoras en el Chat para ofrecerte una mejor experiencia. Por favor, intenta más tarde.
                </Text>

                {/* Status message */}
                <Box
                    p={4}
                    borderRadius="lg"
                    bg={colorMode === "dark" ? "gray.800" : "blue.50"}
                    borderLeft="4px"
                    borderColor="blue.500"
                >
                    <Text
                        fontSize="sm"
                        color={colorMode === "dark" ? "blue.300" : "blue.700"}
                        fontWeight="medium"
                    >
                        ⏱️ Tiempo estimado: Pronto
                    </Text>
                </Box>
            </VStack>

            <style>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(30px);
                    }
                }
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.7;
                    }
                }
            `}</style>
        </Box>
    );
};
