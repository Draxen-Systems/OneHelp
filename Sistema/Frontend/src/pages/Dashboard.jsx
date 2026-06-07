import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart
} from "recharts";
import styles from "./Dashboard.module.css";

// --------------------------------------------------
// 1. COMPONENTE MÁGICO DA ANIMAÇÃO (React Puro)
// --------------------------------------------------
const NumeroAnimado = ({ valorFinal }) => {
  const [contador, setContador] = useState(0);

  useEffect(() => {
    let inicio = null;
    const duracao = 1000; 

    const animar = (tempoAtual) => {
      if (!inicio) inicio = tempoAtual;
      const progresso = tempoAtual - inicio;
      const porcentagem = Math.min(progresso / duracao, 1);
      
      setContador(Math.floor(valorFinal * porcentagem));

      if (porcentagem < 1) {
        requestAnimationFrame(animar);
      }
    };

    requestAnimationFrame(animar);
  }, [valorFinal]);

  return <span>{contador}</span>;
};

// --------------------------------------------------
// 2. DADOS FALSOS (Mock Data)
// --------------------------------------------------

// Dados dos Cards Superiores
const dadosCards = [
  { titulo: "Animais Disponíveis", valor: 300 },
  { titulo: "Novos Clientes", valor: 1200 },
  { titulo: "Animais Adotados", valor: 4521 },
  { titulo: "Cachorros Disponíveis", valor: 2052 }
];

// Dados do Gráfico de Linhas/Barras
const dataMensal = [
  { name: "JAN", resgates: 12, adocoes: 14 },
  { name: "FEV", resgates: 9, adocoes: 12 },
  { name: "MAR", resgates: 14, adocoes: 13 },
  { name: "ABR", resgates: 17, adocoes: 27 },
  { name: "MAI", resgates: 20, adocoes: 20 },
  { name: "JUN", resgates: 15, adocoes: 16 },
  { name: "JUL", resgates: 20, adocoes: 33 },
  { name: "SET", resgates: 21, adocoes: 20 },
  { name: "OUT", resgates: 34, adocoes: 27 },
  { name: "NOV", resgates: 26, adocoes: 15 },
  { name: "DEC", resgates: 32, adocoes: 33 },
];

// Dados do Gráfico Horizontal
const dataBairros = [
  { name: "PINHEIROS", animais: 6 },
  { name: "JARDIM EUROPA", animais: 16 },
  { name: "MOEMA", animais: 15 },
  { name: "TATUAPÉ", animais: 20 },
  { name: "VILA MARIANA", animais: 21 },
  { name: "CENTRO", animais: 33 },
];

const Dashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      
      {/* Linha dos Cards Superiores usando o .map para ficar mais limpo */}
      <div className={styles.cardsRow}>
        {dadosCards.map((card, index) => (
          <div className={styles.card} key={index}>
            <h3>{card.titulo}</h3>
            {/* O P chama o nosso componente animado! */}
            <p><NumeroAnimado valorFinal={card.valor} /></p>
          </div>
        ))}
      </div>

      {/* Linha dos Gráficos */}
      <div className={styles.chartsRow}>
        
        {/* Gráfico 1: Resgates vs Adoções */}
        <div className={styles.chartBox}>
          <h3 className={styles.chartTitle}>RESGATES VS. ADOÇÕES (Mês a Mês - 2024)</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={dataMensal} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="resgates" fill="#6a9683" barSize={20} radius={[2, 2, 0, 0]} />
                <Line type="monotone" dataKey="adocoes" stroke="#f18963" strokeWidth={2} dot={{ r: 4, fill: "#f18963" }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Bairros */}
        <div className={styles.chartBox}>
          <h3 className={styles.chartTitle}>DISTRIBUIÇÃO DE ANIMAIS POR BAIRRO</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataBairros} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="animais" fill="#6a9683" barSize={15} radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;