import { Box } from "@chakra-ui/react";

//Components
import CreateTestFormComponent from "../CreateTestFormComponent/CreateTestFormComponent";
import TestListComponent from "../TestListComponent/TestListComponent";

const CreateWorkflowBody: React.FC = () => {
  return (
    <Box
      w={"100vw"}
      h={"89vh"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        w={"1004px"}
        h={"100%"}
        display={"grid"}
        gridTemplateColumns={"1fr 1fr"}
        justifyContent={"center"}
        alignItems={"center"}
        columnGap={"5rem"}
      >
        <Box>
          <CreateTestFormComponent />
        </Box>
        <Box>
          <TestListComponent />
        </Box>
      </Box>
    </Box>
  );
};

export default CreateWorkflowBody;
