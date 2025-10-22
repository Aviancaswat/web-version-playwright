import { Box } from "@chakra-ui/react";
import { keyframes as emotionKeyframes } from '@emotion/react';

// Definir la animación de pulsación usando Emotion keyframes
const pulse = emotionKeyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);  /* Aumenta el tamaño */
  }
  100% {
    transform: scale(1);  /* Vuelve al tamaño original */
  }
`;

const PulsingBox = () => {
  return (
    <Box
      height="30px"
      width="30px"
      bg="blackAlpha.900"
      borderRadius="50%"  
      animation={`${pulse} 1s infinite`}  
    />
  );
};

export default PulsingBox;
