import styles from './News.module.css';
import 'aos/dist/aos.css';
import feiraAdocaoImg from '../assets/feira_adocao.png'; 
import iconPatinhas from '../assets/icon_patinhas.png'; 

const News = () => {
  return (
    <main className={styles.novidadesPage}>
      <div className={styles.headerSection} data-aos="fade-down">
        <h1 className={styles.pageTitle}>Novidades da Bicho Carente</h1>
        
        <div className={styles.dividerContainer}>
          <div className={styles.dashedLine}></div>
          <img src={iconPatinhas} alt="Patinhas" className={styles.pawIcon} />
          <div className={styles.dashedLine}></div>
        </div>
      </div>

      <section className={styles.newsList}>
        <article className={styles.newsCard} data-aos="fade-up">
          <div className={styles.newsImageContainer}>
            <img 
              src={feiraAdocaoImg} 
              alt="Feira de Adoção Bicho Carente" 
              className={styles.newsImage} 
            />
          </div>
          
          <div className={styles.newsContent}>
            <h2 className={styles.newsTitle}>Feira da Adoção - Bicho Carente</h2>
            <p className={styles.newsText}>
              Mudar o destino de um animal resgatado é uma das experiências
              mais bonitas que existem. Nesta semana, o Bicho Carente abre as
              portas para que você encontre seu novo melhor amigo. Não é
              apenas sobre dar um teto, é sobre ganhar uma lealdade que não
              tem preço. Venha conhecer nossos peludos, ouvir suas histórias e
              descobrir que o amor verdadeiro tem quatro patas e um rabinho
              que não para de abanar.
            </p>
            <p className={styles.newsHighlight}>
              Não compre um amigo, mude um destino. Adote!
            </p>
          </div>
        </article>
      </section>
    </main>
  );
};

export default News;