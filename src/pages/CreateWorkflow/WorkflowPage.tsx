import { Box } from "@chakra-ui/react";

//Components
import CreateWorkflowBody from "../../components/CreateWorkflowBody/CreateWorkflowBody";

const WorkflowsPage = () => {
  return (
    <Box height={"100%"} placeContent={"center"}>
      <CreateWorkflowBody />
    </Box>
  );
};

export default WorkflowsPage;
