import { Route, Routes } from "react-router-dom";

//Components
import DashboardPage from "../pages/Dashboard/DashboardPage";
import HomePage from "../pages/Home/HomePage";
import WorkflowsPage from "../pages/CreateWorkflow/WorkflowPage";

const RoutesApp = () => {
  return (
    <Routes>
      <Route index path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/create-test" element={<WorkflowsPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};

export default RoutesApp;
