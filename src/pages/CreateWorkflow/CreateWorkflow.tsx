//Components
import CreateWorkflowBody from "../../components/CreateWorkflowBody/CreateWorkflowBody";
import LoadingScreenComponent from "../../components/LoadingScreenComponent/LoadingScreenComponent";
import Navbar from "../../components/Navbar/Navbar";

const CreateWorkflow: React.FC = () => {
  return (
    <>
      <LoadingScreenComponent />
      <Navbar />
      <CreateWorkflowBody />
    </>
  );
};

export default CreateWorkflow;
