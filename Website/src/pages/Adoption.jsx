import { useState } from 'react';
import styles from './Adoption.module.css';
import 'aos/dist/aos.css';

import imgBob from '../assets/imgBob.png';
import imgMinnie from '../assets/imgMinnie.png';
import imgZoinho from '../assets/imgZoinho.png';
import imgChoco from '../assets/imgChoco.png';
import imgPimposa from '../assets/imgPimposa.png';
import imgGary from '../assets/imgGary.png';

const animaisData = [
  { id: 1, nome: 'Bob', tipo: 'Cachorro', porte: 'Médio', sexo: 'Macho', raca: 'Sem Raça Definida', data: '10/01/2025', img: imgBob },
  { id: 2, nome: 'Minnie', tipo: 'Gato', porte: 'Pequeno', sexo: 'Fêmea', raca: 'Tigrada', data: '10/09/2020', img: imgMinnie },
  { id: 3, nome: 'Zoinho', tipo: 'Cachorro', porte: 'Pequeno', sexo: 'Macho', raca: 'Salsicha', data: '30/11/2022', img: imgZoinho },
  { id: 4, nome: 'Choco', tipo: 'Cachorro', porte: 'Médio', sexo: 'Macho', raca: 'Sem Raça Definida', data: '08/11/2019', img: imgChoco },
  { id: 5, nome: 'Pimposa', tipo: 'Gato', porte: 'Pequeno', sexo: 'Fêmea', raca: 'Sem Raça Definida', data: '22/04/2023', img: imgPimposa },
  { id: 6, nome: 'Gary', tipo: 'Gato', porte: 'Pequeno', sexo: 'Macho', raca: 'Sem Raça Definida', data: '30/11/2022', img: imgGary },
];

const Adoption = () => {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtros, setFiltros] = useState({
    tipo: [],
    sexo: [],
    porte: []
  });

  const handleFiltro = (categoria, valor) => {
    setFiltros((prevFiltros) => {
      const valoresAtuais = prevFiltros[categoria];
      if (valoresAtuais.includes(valor)) {
        return { ...prevFiltros, [categoria]: valoresAtuais.filter((item) => item !== valor) };
      } else {
        return { ...prevFiltros, [categoria]: [...valoresAtuais, valor] };
      }
    });
    setPaginaAtual(1);
  };

  const animaisFiltrados = animaisData.filter((animal) => {
    const matchTipo = filtros.tipo.length === 0 || filtros.tipo.includes(animal.tipo);
    const matchSexo = filtros.sexo.length === 0 || filtros.sexo.includes(animal.sexo);
    const matchPorte = filtros.porte.length === 0 || filtros.porte.includes(animal.porte);
    return matchTipo && matchSexo && matchPorte;
  });

  const itensPorPagina = 6;
  const totalPaginas = Math.ceil(animaisFiltrados.length / itensPorPagina);
  const animaisPaginados = animaisFiltrados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  return (
    <main className={styles.adoptionPage}>
      <h1 className={styles.pageTitle} data-aos="fade-down">Conheça nossos animais disponíveis</h1>

      <div className={styles.contentWrapper}>
        <aside className={styles.sidebar} data-aos="fade-right">
          
          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Animais</h3>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={filtros.tipo.includes('Cachorro')} onChange={() => handleFiltro('tipo', 'Cachorro')} /> Cachorro
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={filtros.tipo.includes('Gato')} onChange={() => handleFiltro('tipo', 'Gato')} /> Gatos
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={filtros.tipo.includes('Cavalo')} onChange={() => handleFiltro('tipo', 'Cavalo')} /> Cavalos
            </label>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Sexo</h3>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={filtros.sexo.includes('Macho')} onChange={() => handleFiltro('sexo', 'Macho')} /> Macho
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={filtros.sexo.includes('Fêmea')} onChange={() => handleFiltro('sexo', 'Fêmea')} /> Fêmea
            </label>
          </div>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Porte</h3>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={filtros.porte.includes('Grande')} onChange={() => handleFiltro('porte', 'Grande')} /> Grande
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={filtros.porte.includes('Médio')} onChange={() => handleFiltro('porte', 'Médio')} /> Médio
            </label>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={filtros.porte.includes('Pequeno')} onChange={() => handleFiltro('porte', 'Pequeno')} /> Pequeno
            </label>
          </div>
          
          <div className={styles.pawsBackground}></div>
        </aside>

        <section className={styles.cardsArea}>
          <div className={styles.cardsGrid}>
            {animaisPaginados.length > 0 ? (
              animaisPaginados.map((animal, index) => (
                <div className={styles.animalCard} key={animal.id} data-aos="fade-up" data-aos-delay={(index % itensPorPagina) * 100}>
                  <img src={animal.img} alt={`Foto do ${animal.nome}`} className={styles.animalImage} />
                  <h2 className={styles.animalName}>Adote {['Minnie', 'Pimposa'].includes(animal.nome) ? 'a' : 'o'} {animal.nome}</h2>
                  <p className={styles.animalInfo}>{animal.sexo} • {animal.porte}</p>
                  <p className={styles.animalInfo}>{animal.raca}</p>
                  <p className={styles.animalDate}>No abrigo desde: {animal.data}</p>
                  <button className={styles.btnHistory}>Conheça minha história</button>
                </div>
              ))
            ) : (
              <p className={styles.noResults}>Nenhum animal encontrado com esses filtros.</p>
            )}
          </div>

          {totalPaginas > 1 && (
            <div className={styles.pagination}>
              <button 
                className={styles.pageArrow} 
                onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
              >
                ←
              </button>
              
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                <span 
                  key={numero} 
                  className={paginaAtual === numero ? styles.pageItemActive : styles.pageItem}
                  onClick={() => setPaginaAtual(numero)}
                  style={{ cursor: 'pointer' }}
                >
                  {numero}
                </span>
              ))}

              <button 
                className={styles.pageArrow} 
                onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaAtual === totalPaginas}
              >
                →
              </button>
            </div>
          )}
        </section>

      </div>
    </main>
  );
};

export default Adoption;