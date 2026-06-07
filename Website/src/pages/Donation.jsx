import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Donation.module.css"; 
import QRcode from "../assets/QRcode.png";
import Racao from "../assets/Racao.png";
import Porquinho from "../assets/Kofrinho.png";
import iconeCoracao from "../assets/iconeCoracao.png";

export function Donation() {
  const [copiado, setCopiado] = useState(false);

  const codigoPix = "";

  const handleCopiarPix = async () => {
    try {
      await navigator.clipboard.writeText(codigoPix);
      setCopiado(true);
      setTimeout(() => {
        setCopiado(false);
      }, 2500);
    } catch (err) {
      console.error("Falha ao copiar o código Pix: ", err);
      alert("Não foi possível copiar o código.");
    }
  };

  return (
    <div className={styles["donation-container"]}>
      <div className={styles["cards-wrapper"]}>
        
        <div className={styles.card} data-aos="fade-up">
          <img src={QRcode} alt="QR Code Pix" />
          <h2>Doação via Pix</h2>
          <p>Sua ajuda financeira sustenta nossa missão!</p>
          <button 
            className={`${styles["btn-card"]} ${copiado ? styles["btn-success"] : ""}`} 
            onClick={handleCopiarPix}
          >
            {copiado ? "Copiado! ✔️" : "Copiar Pix"}
          </button>
        </div>

          <div className={styles.card} data-aos="fade-up" data-aos-delay="200">
          <img src={Racao} alt="Ração de cachorro" />
          <h2>Doação de rações</h2>
          <p>Abasteça nossa despensa e mantenha barriguinhas cheias!</p>
          <Link to="/ong" className={styles["btn-card"]}>
            Local de Entrega
          </Link>
        </div>

        <div className={styles.card} data-aos="fade-up" data-aos-delay="400">
          <img src={Porquinho} alt="Porquinho Vakinha" />
          <h2>Doação Vakinha</h2>
          <p>Sua ajuda para nossa Vakinha é importante para os animais!</p>
          <a 
            href="https://www.vakinha.com.br/usuario/camila-gomes-1755727373"  
            target="_blank" 
            rel="noopener noreferrer"
            className={styles["btn-card"]}
          >
            Acessar Vakinha
          </a>
        </div>
      </div>

      <div className={styles["quote-section"]} data-aos="fade-up" data-aos-delay="600">
        <p>
          "Eles não sabem falar sobre o frio, a fome ou a solidão, mas sabem
          reconhecer, de longe, o som de um coração generoso. Ajudar um animal é
          entender que a vida é preciosa em todas as suas formas. Quando você
          escolhe apoiar o Bicho Carente, você não está apenas enviando ração ou
          recursos, você está enviando um recado silencioso para esses pequenos
          de que eles não foram esquecidos.
        </p>
        <p>
          O seu “pouco” é o “tudo” que sustenta a vida de quem só conhece o
          presente.”
        </p>

        <img
          src={iconeCoracao}
          alt="Coração com cão, gato e pata"
          className={styles["quote-icon"]}
        />
      </div>
    </div>
  );
}

export default Donation;