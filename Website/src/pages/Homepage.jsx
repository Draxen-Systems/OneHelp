import { Link } from 'react-router-dom';
import styles from './Homepage.module.css';
import carrossel from "../assets/carrossel.png"; 
import logoBAZAR from "../assets/logo_bazar.png";
import cachorro_gato from "../assets/cachorro_gato.png";

const Homepage = () => {
  return (
    <main className={styles.homeContainer}>
      <section className={styles.bannerSection} data-aos="fade-up">
        <img src={carrossel} alt="Carrossel Bicho Carente" className={styles.bannerImage} />
      </section>

      <div className={styles.cardsWrapper}> 
  <section className={styles.cardsSection}>
    
    <div className={`${styles.card} ${styles.cardOrange}`} data-aos="fade-up">
      <h2>Faça uma Doação!</h2>
      <p>Ajude a manter nosso trabalho</p>
      <Link to="/donation" className={styles.btnGreen}>Saiba mais</Link>
    </div>


    <div className={`${styles.card} ${styles.cardBeige}`} data-aos="fade-up" data-aos-delay="200">
      <h2>Nossas Novidades!</h2>
      <p>Fique por dentro</p>
      <Link to="/novidades" className={styles.btnGreen}>Saiba mais</Link>
    </div>

    <div className={`${styles.card} ${styles.cardBrown}`} data-aos="fade-up" data-aos-delay="400">
      <h2>Quero Adotar!</h2>
      <p>Candidate-se para adotar</p>
      <Link to="/adote" className={styles.btnGreen}>Saiba mais</Link>
    </div>

  </section>
</div>

      <section className={styles.bazarContainer}>
        <div className={styles.bazarContent} data-aos="fade-right">
          <h2 className={styles.bazarTitle}>Bazar Bicho Carente</h2>
          <div className={styles.bazarText}>
            <p>
              Transforme seu armário em um ato de amor!<br />
              No Bazar Bicho Carente, seu desapego vira cuidado real.
            </p>
            <p>
              Toda a renda das vendas é 100% destinada aos nossos animais.
            </p>
            <p>
              <strong>Aceitamos doações de:</strong><br />
              roupas, acessórios e objetos de casa.
            </p>
            <p>
              <strong>Não pode doar? Venha comprar!</strong><br />
              Garimpar aqui é garantir barriguinha cheia para quem mais precisa.
            </p>
          </div>
          
          <div className={styles.bazarActionRow}>
            <Link to="/donation" className={styles.btnDoar}>Doar Agora</Link>
            <img src={cachorro_gato} alt="Cachorro e Gato" className={styles.silhuetaPets} />
          </div>
        </div>

        <div className={styles.bazarImageContainer} data-aos="fade-right" data-aos-delay="300">
          <img src={logoBAZAR} alt="Logo Bazar Bicho Carente" className={styles.bazarImage} />
        </div>
      </section>
      
    </main>
  );
};

export default Homepage;