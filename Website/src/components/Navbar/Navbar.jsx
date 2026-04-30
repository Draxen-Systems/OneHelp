import "./Navbar.css";
import logoONG from "../../assets/Logo_semFundo.png";

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="logo-placeholder">
          <img src={logoONG} alt="Não Achei fio" />
        </div>

        <nav className="nav-links">
          <a href="#">Nossa ONG</a>
          <a href="#">Adote</a>
          <a href="#">Novidades</a>
          <a href="#">Contato</a>
          <button className="btn-doacao">Doação</button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
