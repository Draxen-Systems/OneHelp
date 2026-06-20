import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

// --- Telas Públicas ---
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PerfilPage from "./pages/PerfilPage";

// --- Animais ---
import Cadanimals from "./pages/Cadanimals";
import Listanimals from "./pages/ListAnimals";
import CadRace from "./pages/CadRace";
import CadSpecies from "./pages/CadSpecies";

// --- Clientes ---
import CadAdopter from "./pages/CadAdopter";
import ListAdopter from "./pages/ListAdopter";

// --- Voluntários ---
import CadVoluntary from './pages/CadVoluntary';
import ListVoluntary from './pages/ListVoluntary';

const DashboardLayout = () => {
  return (
    <div className="App">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/perfil" element={<PerfilPage />} /> 
            <Route path="/cadanimals" element={<Cadanimals />} />
            <Route path="/cadanimals/:id" element={<Cadanimals />} />
            <Route path="/listanimals" element={<Listanimals />} />
            <Route path="/cadrace" element={<CadRace />} />
            <Route path="/cadspecies" element={<CadSpecies />} />
            <Route path="/cadadopter" element={<CadAdopter />} />
            <Route path="/cadadopter/:id" element={<CadAdopter />} />
            <Route path="/listadopter" element={<ListAdopter />} />
            <Route path="/cadvoluntary" element={<CadVoluntary />} />
            <Route path="/listvoluntary" element={<ListVoluntary />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;