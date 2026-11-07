import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import FarmerLogin from "./pages/FarmerLogin";
import OfficerLogin from "./pages/OfficerLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/farmer/login" element={<FarmerLogin />} />
        <Route path="/officer/login" element={<OfficerLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;