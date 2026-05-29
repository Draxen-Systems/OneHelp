import styles from "./Contact.module.css";
import FACE from "../assets/Facebook_Logo.png";
import INSTA from "../assets/Instagram (2).svg";
import WHATS from "../assets/Whatsapp2.svg";
import EMAIL from "../assets/gmail.svg";
import cat from "../assets/cat.svg";
import dog from "../assets/dog.svg";
import bone from "../assets/bone2.svg";
import paw from "../assets/paw3.svg";

const Contact = () => {
  return (
    <div className={styles.containerPrincipal}>
      <h1 className={styles.tituloContainer}>Nossos Contatos</h1>

      <div className={styles.cardsWrapper}>
        <div
          className={`${styles.card} ${styles.instagram}`}
          data-aos="fade-up"
        >
          <h2 className={styles.cardTitle}>Instagram</h2>
          <img className={styles.logoIcon} src={INSTA} alt="Instagram Logo" />
          <img
            className={`${styles.cardImage} ${styles.image1}`}
            src={cat}
            alt="Gatinho"
          />
          <p className={styles.cardText}>@bichocarenteoficial</p>
          <a
            href="https://instagram.com/bichocarenteoficial"
            target="_blank"
            rel="noreferrer"
            className={`${styles.btnCard} ${styles.btnCard1}`}
          >
            Visitar Instagram
          </a>
        </div>

        <div
          className={`${styles.card} ${styles.whatsapp}`}
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <h2 className={styles.cardTitle}>Whatsapp</h2>
          <img className={styles.logoIcon} src={WHATS} alt="Whatsapp Logo" />
          <img
            className={`${styles.cardImage} ${styles.image2}`}
            src={dog}
            alt="Cachorro"
          />
          <p className={styles.cardText}>+55 19 99015-1408</p>
          <a
            href="https://wa.me/5519990151408"
            target="_blank"
            rel="noreferrer"
            className={`${styles.btnCard} ${styles.btnCard2}`}
          >
            Mandar Mensagem
          </a>
        </div>

        <div
          className={`${styles.card} ${styles.email}`}
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <h2 className={styles.cardTitle}>E-mail</h2>
          <img className={styles.logoIcon} src={EMAIL} alt="Gmail Logo" />
          <img
            className={`${styles.cardImage} ${styles.image3}`}
            src={bone}
            alt="Ossinho"
          />
          <p className={styles.cardText}>apabichocarente@gmail.com</p>
          <a
            href="mailto:apabichocarente@gmail.com"
            className={`${styles.btnCard} ${styles.btnCard3}`}
          >
            Mandar E-mail
          </a>
        </div>

        <div
          className={`${styles.card} ${styles.facebook}`}
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <h2 className={styles.cardTitle}>Facebook</h2>
          <img className={styles.logoIcon} src={FACE} alt="Facebook Logo" />
          <img
            className={`${styles.cardImage} ${styles.image4}`}
            src={paw}
            alt="Patinha"
          />
          <p className={styles.cardText}>Bicho Carente</p>
          <a
            href="https://facebook.com/bichocarenteoficial"
            target="_blank"
            rel="noreferrer"
            className={`${styles.btnCard} ${styles.btnCard4}`}
          >
            Visitar Facebook
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
