import { BrowserRouter, Route, Routes } from "react-router-dom";

//Styles
import "./App.css";

//Components
import Home from "./pages/Home/Home";
import CreateWorkflow from "./pages/CreateWorkflow/CreateWorkflow";
import Report from "./pages/Report/Report";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crear-workflow" element={<CreateWorkflow />} />
        <Route path="/report" element={<Report />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
