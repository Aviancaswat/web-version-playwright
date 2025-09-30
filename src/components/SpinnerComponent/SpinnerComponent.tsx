import { Box, Spinner, Text } from "@chakra-ui/react";

//Types
import type { SpinnerComponentProps } from "./SpinnerComponent.types";

const SpinnerComponent: React.FC<SpinnerComponentProps> = ({ showSpinner }) => {
  return showSpinner ? (
    <Box
      position={"absolute"}
      zIndex={10}
      h={"100%"}
      w={"100%"}
      backgroundColor={"#ffffff80"}
      backdropFilter="blur(2px)"
      borderRadius="md"
    >
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        w={"100%"}
        h={"100%"}
        flexDirection={"column"}
        rowGap={3}
      >
        <Spinner size="lg" color="red.600" />
        <Text color="blackAlpha.900">
          Ejecutando prueba... Esto puede tardar unos minutos.
        </Text>
      </Box>
    </Box>
  ) : null;
};

export default SpinnerComponent;
