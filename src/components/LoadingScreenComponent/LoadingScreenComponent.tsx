import { Box } from "@chakra-ui/react";

//Store
import useLoadingStore from "../../store/useLoadingStore";

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
        justifyContent={"center"}
        alignItems={"center"}
      >
        <img
          width={"150px"}
          height={"auto"}
          src="/public/plane-loader.gif"
          alt="loader plane image"
        />
      </Box>
    </Box>
  ) : null;
};

export default LoadingScreenComponent;
