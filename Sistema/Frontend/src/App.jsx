import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Perfiladm/Header"; 
import "./App.css";

// --- Animais ---
import Cadanimals from './pages/Cadanimals';
import Listanimals from './pages/ListAnimals';
import CadAdopter from './pages/CadAdopter';

// Clientes
import ListAdopter from "./pages/ListAdopter";
const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Sidebar />

        <main className="main-content">
          <Header />

          <Routes>
            <Route path="/Cadanimals" element={<Cadanimals />} />
            <Route path="/Listanimals" element={<Listanimals />} />
            <Route path="/CadAdopter" element={<CadAdopter />} />
            <Route path="/ListAdopter" element={<ListAdopter />} />

          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
};

export default App;