import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logoONG from "../../assets/Logo_semFundo.png";

const Navbar = () => {
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="logo-placeholder">
          <img src={logoONG} alt="Não Achei fio" />
        </div>

        <button className="menu-icon" onClick={toggleMenu}>
          {menuAberto ? "✖" : "☰"}
        </button>

        <nav className={`nav-links ${menuAberto ? "ativo" : ""}`}>
          <Link to="/nossa-ong" onClick={toggleMenu}>
            Nossa ONG
          </Link>
          <Link to="/adote" onClick={toggleMenu}>
            Adote
          </Link>
          <Link to="/novidades" onClick={toggleMenu}>
            Novidades
          </Link>
          <Link to="/contato" onClick={toggleMenu}>
            Contato
          </Link>
          <Link to="/donation" className="btn-doacao" onClick={toggleMenu}>
            Doação
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
