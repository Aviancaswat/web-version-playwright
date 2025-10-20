import { Route, Routes } from "react-router-dom";
import ChatAgentPage from "../pages/Chat/ChatAgentPage";
import WorkflowsPage from "../pages/CreateWorkflow/WorkflowPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import HomePage from "../pages/Home/HomePage";

const RoutesApp = () => {
  return (
    <Routes>
      <Route index path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/create-test" element={<WorkflowsPage />} />
      <Route path="/chat-ai" element={<ChatAgentPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};

export default RoutesApp;
