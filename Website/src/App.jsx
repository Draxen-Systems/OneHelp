import { useEffect } from "react"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Contact from "./pages/Contact";
import Ong from "./pages/Ong";
import Donation from "./pages/Donation";
import Homepage from "./pages/Homepage";
import Adoption from "./pages/Adoption";
import News from "./pages/News";
import "./App.css";

import AOS from "aos";
import "aos/dist/aos.css";

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,  
      offset: 100, 
    });
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/ong" element={<Ong />} />
            <Route path="/donation" element={<Donation />} />
            <Route path="/adote" element={<Adoption />} />
            <Route path="/news" element={<News />} /> 
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;