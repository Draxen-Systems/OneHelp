import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Perfiladm/Header";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

// --- Telas Públicas ---
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// --- Animais ---
import Cadanimals from "./pages/Cadanimals";
import Listanimals from "./pages/ListAnimals";

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
        <Header />
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
            <Route path="/cadanimals" element={<Cadanimals />} />
            <Route path="/cadanimals/:id" element={<Cadanimals />} />
            <Route path="/listanimals" element={<Listanimals />} />
            <Route path="/cadadopter" element={<CadAdopter />} />
            <Route path="/cadadopter/:id" element={<CadAdopter />} />
            <Route path="/listadopter" element={<ListAdopter />} />
            <Route path="/cadvoluntary" element={<CadVoluntary />} />
            <Route path="/cadvoluntary/:id" element={<CadVoluntary />} />
            <Route path="/listvoluntary" element={<ListVoluntary />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;