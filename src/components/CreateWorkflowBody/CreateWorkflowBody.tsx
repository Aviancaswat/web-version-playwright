import { Box } from "@chakra-ui/react";

//Components
import CreateTestFormComponent from "../CreateTestFormComponent/CreateTestFormComponent";
import TestListComponent from "../TestListComponent/TestListComponent";

//Constants
const NAVBAR_H = "63px";

const CreateWorkflowBody: React.FC = () => {
  return (
    <Box
      minH={`calc(100dvh - ${NAVBAR_H})`}
      bg="#F5F7FA"
      px={{ base: 4, lg: 8 }}
      py={{ base: 6, lg: 8 }}
      display="flex"
      justifyContent="center"
    >
      <Box
        w="100%"
        maxW="1400px"
        display="grid"
        gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }}
        columnGap="3rem"
        rowGap="2rem"
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
