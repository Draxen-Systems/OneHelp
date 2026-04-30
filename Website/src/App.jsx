import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content"></main>
      <Footer />
    </div>
  );
};

export default App;
