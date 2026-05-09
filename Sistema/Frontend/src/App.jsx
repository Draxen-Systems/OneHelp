import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Perfiladm/Header"; 
import "./App.css";
import Cadanimals from './pages/Cadanimals';

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Sidebar />

        <main className="main-content">
          <Header />

          <Routes>
            <Route path="/Cadanimals" element={<Cadanimals />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
};

export default App;