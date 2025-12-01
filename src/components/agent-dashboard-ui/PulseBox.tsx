import { Box } from "@chakra-ui/react";
import { keyframes as emotionKeyframes } from '@emotion/react';

const pulse = emotionKeyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3); 
  }
  100% {
    transform: scale(1);
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
