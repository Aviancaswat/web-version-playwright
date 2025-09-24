import { Box } from "@chakra-ui/react";

//Components
import HomeBody from "../../components/HomeBody/HomeBody";

const HomePage = () => {
  return (
    <Box display={"grid"} placeContent={"center"} height={"100%"}>
      <HomeBody />
    </Box>
  );
};

export default HomePage;
