import { Box, Text } from "@chakra-ui/react";

//Store
import useLoadingStore from "../../store/useLoadingStore/useLoadingStore";

const LoadingScreenComponent: React.FC = () => {
  const { showLoading } = useLoadingStore();

  return showLoading ? (
    <Box
      w={"100vw"}
      h={"100vh"}
      position={"absolute"}
      backgroundColor={"#ffffff"}
      zIndex={9999}
    >
      <Box
        w={"100%"}
        h={"100%"}
        display={"flex"}
        flexDirection={"column"}
        rowGap={3}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <img
          width={"150px"}
          height={"auto"}
          src="/plane-loader.gif"
          alt="loader plane image"
        />
        <Text color="blackAlpha.900">
          Ejecutando prueba... Esto puede tardar unos minutos.
        </Text>
      </Box>
    </Box>
  ) : null;
};

export default LoadingScreenComponent;
