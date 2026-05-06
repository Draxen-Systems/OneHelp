import { useState } from 'react';
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

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside className={`${styles.sidebar} ${!isOpen ? styles.collapsed : ''}`}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logoContainer}>
          <img src={isOpen ? LogoSystem : LogoMini} alt="OneHelp Logo" className={styles.logoImg} />
        </div>
        <button className={styles.menuBtn} onClick={toggleSidebar}>
          <div>
            ☰
          </div>
        </button>
      </div>

      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <a href="#" className={`${styles.navLink} ${styles.active}`}>
            <img src={Dashboardlogo} alt="Dashboard" className={styles.navIcon} />
            <span className={styles.navText}>Dashboard</span>
          </a>
        </li>
        <li className={styles.navItem}>
          <a href="#" className={styles.navLink}>
            <img src={animaisLogo} alt="Animais" className={styles.navIcon} />
            <span className={styles.navText}>Animais</span>
          </a>
        </li>
        <li className={styles.navItem}>
          <a href="#" className={styles.navLink}>
            <img src={clientesLogo} alt="Clientes" className={styles.navIcon} />
            <span className={styles.navText}>Clientes</span>
          </a>
        </li>
        <li className={styles.navItem}>
          <a href="#" className={styles.navLink}>
            <img src={funcionariosLogo} alt="Funcionários" className={styles.navIcon} />
            <span className={styles.navText}>Funcionários</span>
          </a>
        </li>
        <li className={styles.navItem}>
          <a href="#" className={styles.navLink}>
            <img src={novidadesLogo} alt="Novidades" className={styles.navIcon} />
            <span className={styles.navText}>Novidades</span>
          </a>
        </li>
      </ul>

      <div className={styles.logoutSection}>
        <a href="#" className={styles.navLink}>
          <img src={sairLogo} alt="Sair" className={styles.navIcon} />
          <span className={styles.navText}>Sair</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;