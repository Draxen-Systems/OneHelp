import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Perfiladm/Header"; 
import "./App.css";
import Cadanimals from './pages/Cadanimals';
import Listanimals from './pages/ListAnimals';

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
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
};

export default App;