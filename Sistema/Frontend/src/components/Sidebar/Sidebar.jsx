import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { logout } from "../../utils/auth";

// --- Assets ---
import LogoSystem from "../../assets/OneHelp_Branco.png";
import LogoMini from "../../assets/OneHelp_Branco_Dog.png";
import PerfilLogo from "../../assets/Perfil.png"; 
import Dashboardlogo from "../../assets/dashboard.png";
import animaisLogo from "../../assets/paw.png";
import clientesLogo from "../../assets/group.png";
import funcionariosLogo from "../../assets/group (1).png"; 
import sairLogo from "../../assets/fire-exit.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const [isAnimaisOpen, setIsAnimaisOpen] = useState(false);
  const [isClientesOpen, setIsClientesOpen] = useState(false);
  const [isVoluntariosOpen, setIsVoluntariosOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
    setIsAnimaisOpen(false);
    setIsClientesOpen(false);
    setIsVoluntariosOpen(false);
  };

  const toggleAnimaisDropdown = () => setIsAnimaisOpen(!isAnimaisOpen);
  const toggleClientesDropdown = () => setIsClientesOpen(!isClientesOpen);
  const toggleVoluntariosDropdown = () => setIsVoluntariosOpen(!isVoluntariosOpen); 

  const checkActive = (path) =>
    location.pathname === path ? styles.active : "";

  const checkActiveParent = (paths) =>
    paths.some((path) =>
      location.pathname.toLowerCase().startsWith(path.toLowerCase()),
    )
      ? styles.active
      : "";

  return (
    <aside 
      className={`${styles.sidebar} ${!isOpen ? styles.collapsed : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.sidebarHeader}>
        <div className={styles.logoContainer}>
          {isOpen ? (
            <img
              src={LogoSystem}
              alt="OneHelp Logo"
              className={styles.logoFull}
            />
          ) : (
            <img
              src={LogoMini}
              alt="OneHelp Logo"
              className={styles.logoMini}
            />
          )}
        </div>
      </div>

      {/* --- Navegação principal --- */}
      <ul className={styles.navList}>
        
        {/* --- Perfil (Novo botão adicionado no topo) --- */}
        <li className={styles.navItem}>
          <Link
            to="/perfil"
            className={`${styles.navLink} ${checkActive("/perfil")}`}>
            <img
              src={PerfilLogo}
              alt="Perfil"
              className={styles.navIcon}
            />
            <span className={styles.navText}>Meu Perfil</span>
          </Link>
        </li>

        {/* --- Dashboard --- */}
        <li className={styles.navItem}>
          <Link
            to="/dashboard"
            className={`${styles.navLink} ${checkActive("/dashboard")}`}>
            <img
              src={Dashboardlogo}
              alt="Dashboard"
              className={styles.navIcon}
            />
            <span className={styles.navText}>Dashboard</span>
          </Link>
        </li>

        {/* --- Animais (dropdown) --- */}
        <li className={styles.navItem}>
          <div
            className={`${styles.navLink} ${checkActiveParent(["/animais", "/cadanimals", "/listanimals", "/cadrace", "/cadspecies"])}`}
            onClick={toggleAnimaisDropdown}
            style={{ cursor: "pointer" }}>
            <img src={animaisLogo} alt="Animais" className={styles.navIcon} />
            <span className={styles.navText}>Animais</span>
            {isOpen && (
              <span
                className={`${styles.arrowIcon} ${isAnimaisOpen ? styles.arrowOpen : ""}`}>
                ∨
              </span>
            )}
          </div>

          {isOpen && (
            <ul
              className={`${styles.dropdownList} ${isAnimaisOpen ? styles.dropdownOpen : ""}`}>
              <li className={styles.dropdownItem}>
                <Link
                  to="/cadanimals"
                  className={`${styles.dropdownLink} ${checkActive("/cadanimals")}`}>
                  - Cadastrar Animal
                </Link>
              </li>
              <li className={styles.dropdownItem}>
                <Link
                  to="/listanimals"
                  className={`${styles.dropdownLink} ${checkActive("/listanimals")}`}>
                  - Listar Animais
                </Link>
              </li>
              <li className={styles.dropdownItem}>
                <Link
                  to="/cadrace"
                  className={`${styles.dropdownLink} ${checkActive("/cadrace")}`}>
                  - Cadastrar Raça
                </Link>
              </li>
              <li className={styles.dropdownItem}>
                <Link
                  to="/cadspecies"
                  className={`${styles.dropdownLink} ${checkActive("/cadspecies")}`}>
                  - Cadastrar Espécie
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* --- Clientes (dropdown) --- */}
        <li className={styles.navItem}>
          <div
            className={`${styles.navLink} ${checkActiveParent(["/clientes", "/cadadopter", "/listadopter"])}`}
            onClick={toggleClientesDropdown}
            style={{ cursor: "pointer" }}>
            <img src={clientesLogo} alt="Clientes" className={styles.navIcon} />
            <span className={styles.navText}>Clientes</span>
            {isOpen && (
              <span
                className={`${styles.arrowIcon} ${isClientesOpen ? styles.arrowOpen : ""}`}>
                ∨
              </span>
            )}
          </div>

          {isOpen && (
            <ul
              className={`${styles.dropdownList} ${isClientesOpen ? styles.dropdownOpen : ""}`}>
              <li className={styles.dropdownItem}>
                <Link
                  to="/cadadopter"
                  className={`${styles.dropdownLink} ${checkActive("/cadadopter")}`}>
                  - Cadastrar Cliente
                </Link>
              </li>
              <li className={styles.dropdownItem}>
                <Link
                  to="/listadopter"
                  className={`${styles.dropdownLink} ${checkActive("/listadopter")}`}>
                  - Listar Clientes
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* --- Voluntários (dropdown) --- */}
        <li className={styles.navItem}>
          <div
            className={`${styles.navLink} ${checkActiveParent(["/voluntarios", "/cadvoluntary", "/listvoluntary"])}`}
            onClick={toggleVoluntariosDropdown}
            style={{ cursor: "pointer" }}>
            <img src={funcionariosLogo} alt="Voluntários" className={styles.navIcon} />
            <span className={styles.navText}>Voluntários</span>
            {isOpen && (
              <span
                className={`${styles.arrowIcon} ${isVoluntariosOpen ? styles.arrowOpen : ""}`}>
                ∨
              </span>
            )}
          </div>

          {isOpen && (
            <ul
              className={`${styles.dropdownList} ${isVoluntariosOpen ? styles.dropdownOpen : ""}`}>
              <li className={styles.dropdownItem}>
                <Link
                  to="/cadvoluntary"
                  className={`${styles.dropdownLink} ${checkActive("/cadvoluntary")}`}>
                  - Cadastrar Voluntário
                </Link>
              </li>
              <li className={styles.dropdownItem}>
                <Link
                  to="/listvoluntary"
                  className={`${styles.dropdownLink} ${checkActive("/listvoluntary")}`}>
                  - Listar Voluntários
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>

      {/* --- Rodapé: logout --- */}
      <div className={styles.logoutSection}>
        <button
          type="button"
          onClick={handleLogout}
          className={styles.navLink}
          style={{ background: "none", border: "none", cursor: "pointer", width: "100%" }}
        >
          <img src={sairLogo} alt="Sair" className={styles.navIcon} />
          <span className={styles.navText}>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;