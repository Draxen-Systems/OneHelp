import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Sidebar />

        <main className="main-content">
          <Routes>
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
};

export default App;
