import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

import LogoSystem from '../../assets/OneHelp_Branco.png';
import LogoMini from '../../assets/OneHelp_Branco_Dog.png';
import Dashboardlogo from '../../assets/dashboard.png';
import animaisLogo from '../../assets/paw.png';
import clientesLogo from '../../assets/group.png';
import funcionariosLogo from '../../assets/group (1).png';
import novidadesLogo from '../../assets/news (2).png';
import sairLogo from '../../assets/fire-exit.png';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isAnimaisOpen, setIsAnimaisOpen] = useState(false);
  const [isClientesOpen, setIsClientesOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    // Opcional: Fechar dropdowns se o sidebar colapsar
    if (isOpen) {
        setIsAnimaisOpen(false);
        setIsClientesOpen(false);
    }
  };

  const toggleAnimaisDropdown = () => {
    setIsAnimaisOpen(!isAnimaisOpen);
    // Opcional: fechar outros se este abrir
    // if (isClientesOpen) setIsClientesOpen(false); 
  };

  const toggleClientesDropdown = () => {
    setIsClientesOpen(!isClientesOpen);
    // Opcional: fechar outros se este abrir
    // if (isAnimaisOpen) setIsAnimaisOpen(false);
  };

  const checkActive = (path) => {
    return location.pathname === path ? styles.active : '';
  };

  const checkActiveParent = (paths) => {
    return paths.some(path => location.pathname.toLowerCase().startsWith(path.toLowerCase())) ? styles.active : '';
  };

  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.collapsed : ''}`}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logoContainer}>
          {isOpen ? (
            <img src={LogoSystem} alt="OneHelp Logo" className={styles.logoFull} />
          ) : (
            <img src={LogoMini} alt="OneHelp Logo" className={styles.logoMini} />
          )}
        </div>
        <button className={styles.menuBtn} onClick={toggleSidebar}>
          <div>☰</div>
        </button>
      </div>

      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link to="/dashboard" className={`${styles.navLink} ${checkActive('/dashboard')}`}>
            <img src={Dashboardlogo} alt="Dashboard" className={styles.navIcon} />
            <span className={styles.navText}>Dashboard</span>
          </Link>
        </li>

        {/* --- ANIMAIS --- */}
        <li className={styles.navItem}>
          <div 
            className={`${styles.navLink} ${checkActiveParent(['/animais', '/cadanimals', '/listanimals', '/raceanimals'])}`} 
            onClick={toggleAnimaisDropdown}
            style={{ cursor: 'pointer' }}
          >
            <img src={animaisLogo} alt="Animais" className={styles.navIcon} />
            <span className={styles.navText}>Animais</span>
            {isOpen && (
              // Usamos sempre '∨' e rotacionamos no CSS
              <span className={`${styles.arrowIcon} ${isAnimaisOpen ? styles.arrowOpen : ''}`}>
                ∨
              </span>
            )}
          </div>
          
          {/* SEMPRE renderizamos o ul, controlamos a visibilidade pelo CSS com animação */}
          {isOpen && (
            <ul className={`${styles.dropdownList} ${isAnimaisOpen ? styles.dropdownOpen : ''}`}>
              <li className={styles.dropdownItem}>
                <Link to="/Cadanimals" className={`${styles.dropdownLink} ${checkActive('/Cadanimals')}`}>
                  - Cadastrar Animal
                </Link>
              </li>
              <li className={styles.dropdownItem}>
                <Link to="/listanimals" className={`${styles.dropdownLink} ${checkActive('/listanimals')}`}>
                  - Listar Animais
                </Link>
              </li> 
              <li className={styles.dropdownItem}>
                <Link to="raceanimals" className={`${styles.dropdownLink} ${checkActive('/animais/raca')}`}>
                  - Raça
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* --- CLIENTES --- */}
        <li className={styles.navItem}>
          <div 
            className={`${styles.navLink} ${checkActiveParent(['/clientes', '/cadadopter', '/listclientes'])}`} 
            onClick={toggleClientesDropdown}
            style={{ cursor: 'pointer' }}
          >
            <img src={clientesLogo} alt="Clientes" className={styles.navIcon} />
            <span className={styles.navText}>Clientes</span>
            {isOpen && (
              // Usamos sempre '∨' e rotacionamos no CSS
              <span className={`${styles.arrowIcon} ${isClientesOpen ? styles.arrowOpen : ''}`}>
                ∨
              </span>
            )}
          </div>
          
          {/* SEMPRE renderizamos o ul */}
          {isOpen && (
            <ul className={`${styles.dropdownList} ${isClientesOpen ? styles.dropdownOpen : ''}`}>
              <li className={styles.dropdownItem}>
                <Link to="/cadadopter" className={`${styles.dropdownLink} ${checkActive('/cadadopter')}`}>
                  - Cadastrar Cliente
                </Link>
              </li>
              <li className={styles.dropdownItem}>
                <Link to="/listclientes" className={`${styles.dropdownLink} ${checkActive('/listclientes')}`}>
                  - Listar Clientes
                </Link>
              </li> 
            </ul>
          )}
        </li>

        <li className={styles.navItem}>
          <Link to="/funcionarios" className={`${styles.navLink} ${checkActive('/funcionarios')}`}>
            <img src={funcionariosLogo} alt="Funcionários" className={styles.navIcon} />
            <span className={styles.navText}>Funcionários</span>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/novidades" className={`${styles.navLink} ${checkActive('/novidades')}`}>
            <img src={novidadesLogo} alt="Novidades" className={styles.navIcon} />
            <span className={styles.navText}>Novidades</span>
          </Link>
        </li>
      </ul>

      <div className={styles.logoutSection}>
        <Link to="/login" className={styles.navLink}>
          <img src={sairLogo} alt="Sair" className={styles.navIcon} />
          <span className={styles.navText}>Sair</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;