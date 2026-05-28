import styles from "./Ong.module.css";
import logo from "../assets/Logo_semFundo.png";
import Localizacao from "../assets/loc2.png";
import Horario from "../assets/open2.png";
import Fabiele from "../assets/fabiele.png";
import Luan from "../assets/luan.png";
import Caroline from "../assets/caroline.png";
import Paw from "../assets/coracaopet.png";
import Pets from "../assets/cachorroegato.png";

const Ong = () => {
  return (
    <div>
      {/* ---  Hero --- */}
      <div className={styles.containerPrincipal}>
        <div className={styles.heroSection}>
          <h1 className={styles.ongTitle} data-aos="fade-up">Conheça a nossa ONG</h1>

          <div className={styles.hero}>
            <div className={styles.heroImage} data-aos="fade-up" data-aos-delay="200">
              <img src={logo} alt="Logo da ONG Bicho Carente" />
            </div>

            <div className={styles.ongDescription} data-aos="fade-up" data-aos-delay="400">
              <p className={styles.descriptionText}>
                A Bicho Carente é uma ONG sem fins lucrativos localizada em Leme
                – SP, dedicada ao cuidado, proteção e bem-estar dos animais.
                Nosso principal objetivo é ajudar o maior número possível de
                animais, oferecendo suporte, resgate e a chance de uma vida
                digna e cheia de amor.
              </p>
              <p className={styles.descriptionText}>
                Essa iniciativa nasceu para reunir pessoas que, assim como nós,
                amam e respeitam a vida em todas as suas formas. Acreditamos que
                cada animal merece cuidado, carinho e uma oportunidade.
              </p>
              <p className={styles.descriptionText}>
                Junte-se a nós nessa causa e lute por aqueles que não têm voz!
              </p>
            </div>
          </div>
        </div>

        {/* --- Voluntários */}
        <h2 className={styles.ongTeam}>Conheça a equipe Bicho Carente</h2>

        <div className={styles.cardWrapper}>
          <div className={styles.cardVolunteer}data-aos="fade-up">
            <img
              className={styles.volunteerImage}
              src={Fabiele}
              alt="Fabiele"
            />
            <h3 className={styles.volunteerName}>Fabiele</h3>
            <p className={styles.volunteerRole}>Fundadora da ONG</p>
          </div>
          <div className={styles.cardVolunteer} data-aos="fade-up" data-aos-delay="200">
            <img className={styles.volunteerImage} src={Luan} alt="Luan" />
            <h3 className={styles.volunteerName}>Luan</h3>
            <p className={styles.volunteerRole}>Ajudante do Bazar</p>
          </div>
          <div className={styles.cardVolunteer} data-aos="fade-up" data-aos-delay="400">
            <img
              className={styles.volunteerImage}
              src={Caroline}
              alt="Caroline"
            />
            <h3 className={styles.volunteerName}>Caroline</h3>
            <p className={styles.volunteerRole}>Ajudante do Canil</p>
          </div>
        </div>
      </div>

      {/* --- CTA --- */}
      <div className={styles.volunteerCta}>
        <div className={styles.dividerIcon}>
          <img src={Paw} alt="" aria-hidden="true" />
        </div>

        <p className={styles.ctaText} data-aos="fade-up">
          Tem amor sobrando e quer compartilhar com quem não tem voz? Nossa
          equipe adoraria ter <strong>você</strong> com a gente!
        </p>

        <a 
          href="https://wa.me/5519990151408?text=Olá!%20Tenho%20interesse%20em%20fazer%20parte%20da%20equipe%20da%20Bicho%20Carente."
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaBtn}
          data-aos="fade-up"
        >
          Quero Ajudar
        </a>
      </div>

      {/* --- Localização --- */}

      <div className={styles.containerPrincipal}>
        <section className={styles.location}>
          <div className={styles.locationInfo} data-aos="fade-right">
            <h2 className={styles.locationTitle}>Onde nos encontrar</h2>
            <p className={styles.locationHeader}>Venha nos fazer uma visita!</p>

            <div className={styles.locationAddress}>
              <img
                className={styles.locationIcon}
                src={Localizacao}
                alt=""
                aria-hidden="true"
              />
              <p>Armando Salles Oliveira, N°45, Leme SP, CEP: 13610220</p>
            </div>

            <div className={styles.locationHours}>
              <img
                className={styles.locationIcon}
                src={Horario}
                alt=""
                aria-hidden="true"
              />
              <div>
                <p>Segunda a Sexta: 09:00 às 18:00</p>
                <p>Sábado e Domingo: Fechado</p>
              </div>
            </div>
            <img
              src={Pets}
              alt="Ilustração de cachorro e gato"
              className={styles.animalsIllustration}
              loading="lazy"
            />
          </div>

          <div className={styles.locationMap} data-aos="fade-right" data-aos-delay="300">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3694.4789517128793!2d-47.38311532664175!3d-22.1838974519396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c80b9ba821f987%3A0xc947bfa9fff13dfa!2sR.%20Dr.%20Armando%20Salles%20Oliveira%2C%2045%20-%20Centro%2C%20Leme%20-%20SP%2C%2013610-220!5e0!3m2!1spt-BR!2sbr!4v1777757724091!5m2!1spt-BR!2sbr&output=embed"
              width="100%"
              height="450"
              loading="lazy"
              title="Mapa do endereço da ONG Bicho Carente"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            <a
              href="https://maps.app.goo.gl/Zk5BLRWSEGvCyxQU9"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.locationMapBtn}
            >
              Abrir Google Maps
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Ong;
