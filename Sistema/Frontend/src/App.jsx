import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Perfiladm/Header";
import "./App.css";

// --- Animais ---
import Cadanimals from "./pages/Cadanimals";
import Listanimals from "./pages/ListAnimals";

// --- Clientes ---
import CadAdopter from "./pages/CadAdopter";
import ListAdopter from "./pages/ListAdopter";

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">

        <Sidebar />
        <main className="main-content">
          <Header />

          {/* --- Redirecionamentos --- */}
          <Routes>
            <Route path="/cadanimals"   element={<Cadanimals />} />
            <Route path="/listanimals"  element={<Listanimals />} />
            <Route path="/cadadopter"   element={<CadAdopter />} />
            <Route path="/listadopter"  element={<ListAdopter />} />
          </Routes>

        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;