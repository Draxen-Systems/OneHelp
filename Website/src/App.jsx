import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Donation from "./pages/Donation";
import Contact  from "./pages/Contact";
import Homepage from "./pages/Homepage";

import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/donation" element={<Donation />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
