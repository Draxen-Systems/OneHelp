import "./Footer.css";
import logoONG from "../../assets/Logo_semFundo.png";
import logoFACE from "../../assets/facebook.svg";
import logoINSTA from "../../assets/Instagram.svg";
import logoWHATS from "../../assets/Whatsapp.svg";
import logoEMAIL from "../../assets/Email.png";

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
          <img src={logoONG} alt="Logo Bicho Carente" />
        </div>

        <div className="footer-nav">
          <div className="footer-menu">
            <div className="menu-col">
              <h4>Menu</h4>
              <a href="#">Nossa ONG</a>
              <a href="#">Adote</a>
            </div>

            <div className="menu-col">
              <a href="#">Novidades</a>
              <a href="#">Contato</a>
              <a href="#">Doar</a>
            </div>
          </div>

          <div className="footer-social">
            <img
              src={logoFACE}
              alt="Logo Facebook"
              className="icone-provisorio facebook"
            />
            <img
              src={logoINSTA}
              alt="Logo Instagram"
              className="icone-provisorio instagram"
            />
            <img
              src={logoWHATS}
              alt="Logo WhatssApp"
              className="icone-provisorio instagram"
            />
            <img
              src={logoEMAIL}
              alt="Logo Email"
              className="icone-provisorio instagram"
            />
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
