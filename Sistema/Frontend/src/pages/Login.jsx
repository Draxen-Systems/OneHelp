import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLock, FiUnlock } from "react-icons/fi"; 
import styles from "./Login.module.css";
import Logo from "../assets/OneHelp_Branco.png";

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard"); 
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        
        <div className={styles.cardHeader}>
          <img src={Logo} alt="Logo OneHelp" />
        </div>

        <div className={styles.cardBody}>
          <h1 className={styles.title}>Bem-vindo ao OneHelp!</h1>
          <p className={styles.subtitle}>Acesso para gerenciar resgates e adoções</p>

          <form onSubmit={handleLogin} className={styles.form}>
            
            <div className={`${styles.inputGroup} ${styles.inputOrange}`}>
              <FiUser className={styles.icon}/>
              <input
                type="text"
                placeholder="Usuário"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
              />
            </div>

            <div className={`${styles.inputGroup} ${styles.inputGreen}`}>
              {showPassword ? (
                <FiUnlock 
                  className={`${styles.icon} ${styles.clickable}`} 
                  onClick={() => setShowPassword(false)} 
                />
              ) : (
                <FiLock 
                  className={`${styles.icon} ${styles.clickable}`} 
                  onClick={() => setShowPassword(true)} 
                />
              )}
              
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Entrar
            </button>
          </form>

          <a href="/recuperar-senha" className={styles.forgotPassword}>
            Esqueci minha senha
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;