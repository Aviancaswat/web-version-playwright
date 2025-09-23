import { Route, Routes } from "react-router-dom"
import DashboardPage from "../pages/dashboard-page"
import HomePage from "../pages/home-page"
import NotFoundPage from "../pages/not-found-page"
import WorkflowsPage from "../pages/workflows-page"

const RoutesApp = () => {
    return (
        <Routes>
            <Route index path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-test" element={<WorkflowsPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}

export default RoutesApp;