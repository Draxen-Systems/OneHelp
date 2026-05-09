import { ChevronDown } from 'lucide-react';
import styles from './Header.module.css';
import LogoADM from '../../assets/Logo_semFundo.png'; 

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.adminArea}>
        <div className={styles.logoPlaceholder}>
          <img src={LogoADM} alt="Logo" className={styles.logo} />
        </div>
        <div className={styles.adminInfo}>
          <span className={styles.adminName}>Admin</span>
          <span className={styles.adminEmail}>(apabichocarente@gmail.com)</span>
        </div>
        <ChevronDown className={styles.dropdownIcon} size={20} />
      </div>
    </div>
  );
};

export default Header;