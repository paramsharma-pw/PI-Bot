import { Routes, Route } from "react-router-dom";
import SelectScreen from "./pages/selectScreen";
import Parent from "./pages/parent";
import Child from "./pages/student";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SelectScreen />} />
      <Route path="/parent" element={<Parent />} />
      <Route path="/child" element={<Child />} />
    </Routes>
  );
}

export default App;
