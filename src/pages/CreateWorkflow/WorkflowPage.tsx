import { Box } from "@chakra-ui/react";

//Components
import CreateWorkflowBody from "../../components/CreateWorkflowBody/CreateWorkflowBody";

const WorkflowsPage = () => {
  return (
    <Box
      height={"100%"}
      placeContent={"center"}
      minH="100vh"
      bg="#F5F7FA"
      pt="1rem"
    >
      <CreateWorkflowBody />
    </Box>
  );
};

export default WorkflowsPage;
