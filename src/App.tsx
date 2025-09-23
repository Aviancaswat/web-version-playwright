import LayoutApp from './layout/layout-app';
import RoutesApp from './routes/routes-app';

//Styles
import './App.css';

const App = () => {
  return (
    <LayoutApp>
      <RoutesApp />
    </LayoutApp>
  )
}

export default App;
