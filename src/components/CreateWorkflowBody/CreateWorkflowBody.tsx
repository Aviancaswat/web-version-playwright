import { Box } from "@chakra-ui/react";

//Components
import CreateTestFormComponent from "../CreateTestFormComponent/CreateTestFormComponent";
import TestListComponent from "../TestListComponent/TestListComponent";
const NAVBAR_H = "63px";
const CreateWorkflowBody: React.FC = () => {
  return (
    <Box
      minH={`calc(100dvh - ${NAVBAR_H})`}
      display="flex"
      justifyContent="center"
      alignItems="center" 
      px={{ base: 4, lg: 0 }}
    >
      <Box
        w={{ base: "unset", lg: "1004px" }}
        display="grid"
        gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        alignItems="stretch"           
        columnGap="5rem"
        rowGap="2rem"
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
