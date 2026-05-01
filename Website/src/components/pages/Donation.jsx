import "./Donation.css";
import QRcode from "../assets/QRcode.png";
import Racao from "../assets/Racao.png";
import Porquinho from "../assets/Kofrinho.png";
import iconeCoracao from "../assets/iconeCoracao.png";

export function Donation() {
  return (
    <div className="donation-container">
      <div className="cards-wrapper">
        <div className="card">
          <img src={QRcode} alt="QR Code Pix" />
          <h2>Doação via Pix</h2>
          <p>Sua ajuda financeira sustenta nossa missão!</p>
          <button className="btn-card">Copiar Pix</button>
        </div>

        <div className="card">
          <img src={Racao} alt="Ração de cachorro" />
          <h2>Doação de rações</h2>
          <p>Abasteça nossa despensa e mantenha barriguinhas cheias!</p>
          <button className="btn-card">Local de Entrega</button>
        </div>

        <div className="card">
          <img src={Porquinho} alt="Porquinho Vakinha" />
          <h2>Doação Vakinha</h2>
          <p>Sua ajuda para nossa Vakinha é importante para os animais!</p>
          <button className="btn-card">Acessar Vakinha</button>
        </div>
      </div>
      <div className="quote-section">
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
          className="quote-icon"
        />
      </div>
    </div>
  );
}
