import { Box } from "@chakra-ui/react";

//Components
import CreateTestFormComponent from "../CreateTestFormComponent/CreateTestFormComponent";
import TestListComponent from "../TestListComponent/TestListComponent";

const CreateWorkflowBody: React.FC = () => {
  return (
    <Box
      h={"89vh"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        maxW={{ base: "unset", lg: "1004px" }}
        h={"100%"}
        display={"grid"}
        gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        justifyContent={"center"}
        alignContent={"space-evenly"}
        columnGap={"5rem"}
        rowGap={"2rem"}
        mb={{ base: "5rem", lg: "0" }}
        mt={{ base: "5rem", lg: "0" }}
        alignItems="stretch"
      >
        <Box m={{ base: "0 1rem", lg: "0" }}>
          <CreateTestFormComponent />
        </Box>
        <Box m={{ base: "0 1rem", lg: "0" }}>
          <TestListComponent />
        </Box>
      </Box>
    </Box>
  );
};

export default CreateWorkflowBody;
