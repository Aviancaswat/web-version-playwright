import { Box, Button } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

// Animación del gradiente del borde
const borderAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export default function AnimatedBorderButton() {
    return (
        <Box
            position="relative"
            display="inline-block"
            borderRadius="md"
            p="2px" // grosor del borde
            background="linear-gradient(270deg, #ff0057, #ffcc00, #00ff99, #00aaff, #ff00ff)"
            backgroundSize="600% 600%"
            animation={`${borderAnimation} 6s ease infinite`}
        >
            <Button
                bg="white"
                color="black"
                size="sm"
                borderRadius="md"
                _hover={{
                    bg: "black",
                    color: "white"
                }}
                _active={{
                    transform: "scale(0.98)"
                }}
                position="relative"
                zIndex="1"
            >
                Analizar con APA
            </Button>
        </Box>
    );
}
