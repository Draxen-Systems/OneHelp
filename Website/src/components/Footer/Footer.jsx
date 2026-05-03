import { Link } from 'react-router-dom';
import "./Footer.css";
import logoONG from "../../assets/Logo_semFundo.png";
import logoFACE from "../../assets/Facebook_Logo.png";
import logoINSTA from "../../assets/Instagram (2).svg";
import logoWHATS from "../../assets/Whatsapp2.svg";
import logoEMAIL from "../../assets/gmail.svg";

const Footer = () => {
  const voltarProTopo = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-copyright">
          <p>Todos os direitos reservados</p>
          <p>2026 &copy; por Bicho Carente.</p>
        </div>

        <div className="footer-logo">
            <Link to="/homepage">
              <img src={logoONG} alt="Logo Bicho Carente" />
            </Link>
        </div>

        <div className="footer-nav">
          <div className="footer-menu">
            <div className="menu-col">
            <h4>Menu</h4>
            <Link to="/ong">Nossa ONG</Link>
            <Link to="/">Adote</Link>
          </div>

          <div className="menu-col">
            <Link to="/novidades">Novidades</Link>
            <Link to="/contact">Contato</Link>
            <Link to="/donation">Doar</Link>
          </div>
          </div>

          <div className="footer-social">
            <a href="https://facebook.com/bichocarenteoficial" target="_blank" rel="noopener noreferrer">
              <img src={logoFACE} alt="Logo Facebook" className="icone-provisorio facebook"/>
            </a>
            <a href="https://instagram.com/bichocarenteoficial" target="_blank" rel="noopener noreferrer">
              <img src={logoINSTA} alt="Logo Instagram" className="icone-provisorio instagram"/>
            </a>
            <a href="https://wa.me/5519990151408" target="_blank" rel="noopener noreferrer">
              <img src={logoWHATS} alt="Logo WhatsApp" className="icone-provisorio whatsapp"/>
            </a>
            <a href="mailto:apabichocarente@gmail.com">
              <img src={logoEMAIL} alt="Logo Email" className="icone-provisorio email"/>
            </a>
          </div>
        </div>

        <div className="footer-up">
          <button className="btn-up" onClick={voltarProTopo}>
            <strong>^</strong>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
