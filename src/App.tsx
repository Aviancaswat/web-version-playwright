//Components
import LayoutApp from "./layout/LayoutApp";
import RoutesApp from "./routes/RoutesApp";

//Styles
import "./App.css";

const App = () => {
  return (
    <LayoutApp>
      <RoutesApp />
    </LayoutApp>
  );
};

export default App;
