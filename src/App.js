import "./App.css";
import { Routes, Route } from "react-router-dom";
import ImageCrp from "./pages/ImageCrp";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ImageCrp />} />
      </Routes>
    </div>
  );
}

export default App;
