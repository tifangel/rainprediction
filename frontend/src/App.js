import './App.css';
import CardGraph from "./components/CardGraph";
import Controls from './components/Controls';
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <Controls />
      <CardGraph />
    </div>
  );
}

export default App;
