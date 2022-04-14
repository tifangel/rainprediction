import "@material-tailwind/react/tailwind.css";
import './App.css';
import CardGraph from "./components/CardGraph";
import Numbers from "./components/Numbers";

function App() {
  return (
    <div className="App">
      <Numbers />
      <CardGraph />
    </div>
  );
}

export default App;
