import { useState } from "react";
import { NavLink } from "react-router-dom";
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
          <NavLink to="/nossa-ong" onClick={toggleMenu}>
            Nossa ONG
          </NavLink>
          <NavLink to="/adote" onClick={toggleMenu}>
            Adote
          </NavLink>
          <NavLink to="/novidades" onClick={toggleMenu}>
            Novidades
          </NavLink>
          <NavLink to="/contact" onClick={toggleMenu}>
            Contato
          </NavLink>
          <NavLink to="/donation" className="btn-doacao" onClick={toggleMenu}>
            Doação
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
