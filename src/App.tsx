import { BrowserRouter, Route, Routes } from "react-router-dom";

//Styles
import "./App.css";

//Components
import Home from "./pages/Home/Home";
import CreateWorkflow from "./pages/CreateWorkflow/CreateWorkflow";

//TODO: Corregir responsive
//TODO: Crear ruta de resultados cuando se envian todas las pruebas.
//TODO: Crear componente de pantalla de carga como la pagina de avianca.

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crear-workflow" element={<CreateWorkflow />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
