import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Homepage.module.css';

// Imagens do Carrossel
import banner1 from "../assets/carrossel1.png"; 
import banner2 from "../assets/carrossel2.png";
import banner3 from "../assets/carrossel3.png";

// Ícones dos Cards (Você precisa salvar 3 ícones na sua pasta assets para isso funcionar redondo)
import iconeDoacao from "../assets/icone-doacao.png"; // Substitua pelo nome real do seu arquivo
import iconeNovidades from "../assets/icone-novidades.png"; // Substitua pelo nome real do seu arquivo
import iconeAdotar from "../assets/icone-adotar.png"; // Substitua pelo nome real do seu arquivo

// Imagens do Bazar
import logoBAZAR from "../assets/logo_bazar.png";
import cachorro_gato from "../assets/cachorro_gato.png";

const carouselImages = [banner1, banner2, banner3];

const Homepage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide === carouselImages.length - 1 ? 0 : prevSlide + 1));
    }, 5000);

    return () => clearInterval(slideInterval); 
  }, []);

  return (
    <main className={styles.homeContainer}>
      
      {/* Fundo bege claro que engloba o Carrossel e os Cards */}
      <div className={styles.topSectionWrapper}>
        
        {/* SEÇÃO DO CARROSSEL */}
        <section className={styles.bannerSection} data-aos="fade-up">
          <div className={styles.carouselContainer}>
            
            <div 
              className={styles.carouselTrack} 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselImages.map((img, index) => (
                <img 
                  key={index} 
                  src={img} 
                  alt={`Banner Bicho Carente ${index + 1}`} 
                  className={styles.carouselImage} 
                />
              ))}
            </div>

            <div className={styles.carouselDots}>
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${currentSlide === index ? styles.activeDot : ''}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Ir para o slide ${index + 1}`}
                />
              ))}
            </div>

          </div>
        </section>

        {/* SEÇÃO DOS CARDS MODERNOS */}
        <div className={styles.cardsWrapper}> 
          <section className={styles.cardsSection}>
            
            <div className={`${styles.card} ${styles.cardBorderOrange}`} data-aos="fade-up">
              <img src={iconeDoacao} alt="Ícone Doação" className={styles.cardIcon} />
              <div className={styles.cardContent}>
                <h2>Faça uma Doação!</h2>
                <p>Ajude a manter nosso trabalho</p>
                <Link to="/donation" className={`${styles.btn} ${styles.btnOrange}`}>Saiba mais</Link>
              </div>
            </div>

            <div className={`${styles.card} ${styles.cardBorderGreen}`} data-aos="fade-up" data-aos-delay="200">
              <img src={iconeNovidades} alt="Ícone Novidades" className={styles.cardIcon} />
              <div className={styles.cardContent}>
                <h2>Nossas Novidades!</h2>
                <p>Fique por dentro</p>
                <Link to="/news" className={`${styles.btn} ${styles.btnGreen}`}>Saiba mais</Link>
              </div>
            </div>

            <div className={`${styles.card} ${styles.cardBorderBrown}`} data-aos="fade-up" data-aos-delay="400">
              <img src={iconeAdotar} alt="Ícone Adotar" className={styles.cardIcon} />
              <div className={styles.cardContent}>
                <h2>Quero Adotar!</h2>
                <p>Candidate-se para adotar</p>
                <Link to="/adote" className={`${styles.btn} ${styles.btnBrown}`}>Saiba mais</Link>
              </div>
            </div>

          </section>
        </div>
      </div>

      {/* SEÇÃO DO BAZAR (Intacta) */}
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