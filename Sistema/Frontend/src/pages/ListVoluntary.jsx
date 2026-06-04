import { useState } from 'react';
import { UserCircle2 } from 'lucide-react';
import styles from './ListVoluntary.module.css';

const mockData = [
  { id: 1, foto: null, nome: 'Joaquim', funcao: 'Voluntário Bazar', uf: 'SP', nascimento: '09/09/1990', status: 'Ativo' },
  { id: 2, foto: null, nome: 'Clarice',  funcao: 'Coordenadora',    uf: 'SP', nascimento: '31/10/1983', status: 'Inativo' },
  { id: 3, foto: null, nome: 'Marcos',   funcao: 'Veterinário',     uf: 'SP', nascimento: '14/07/2000', status: 'Ativo' },
];

const ITEMS_PER_PAGE = 10;

const ListVoluntary = ({ onNovo, onEditar, onDeletar }) => {
  const [busca,  setBusca]  = useState('');
  const [funcao, setFuncao] = useState('Todas');
  const [uf,     setUf]     = useState('');
  const [status, setStatus] = useState('Todos');
  const [pagina, setPagina] = useState(1);

  const filtrados = mockData.filter((v) => {
    const matchBusca  = busca === '' || v.nome.toLowerCase().includes(busca.toLowerCase()) || String(v.id).includes(busca);
    const matchFuncao = funcao === 'Todas' || v.funcao === funcao;
    const matchUf     = uf === '' || v.uf.toLowerCase().includes(uf.toLowerCase());
    const matchStatus = status === 'Todos' || v.status === status;
    return matchBusca && matchFuncao && matchUf && matchStatus;
  });

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / ITEMS_PER_PAGE));
  const paginados    = filtrados.slice((pagina - 1) * ITEMS_PER_PAGE, pagina * ITEMS_PER_PAGE);
  const funcoes      = ['Todas', ...Array.from(new Set(mockData.map((v) => v.funcao)))];

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        <h1 className={styles.title}>Listas de Voluntários</h1>
        <button className={styles.btnNovo} onClick={onNovo}>
          Cadastrar Novo Voluntário +
        </button>
      </div>

      <div className={styles.card}>

        {/* Filtros  */}
        <div className={styles.filtros}>
          <input
            type="text"
            placeholder="Nome, ID, CPF"
            className={styles.inputBusca}
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPagina(1); }}
          />
          <div className={styles.filtroGroup}>
            <label className={styles.filtroLabel}>Função</label>
            <select className={styles.select} value={funcao} onChange={(e) => { setFuncao(e.target.value); setPagina(1); }}>
              {funcoes.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className={styles.filtroGroup}>
            <label className={styles.filtroLabel}>UF</label>
            <input
              type="text"
              maxLength={2}
              className={styles.inputUf}
              value={uf}
              onChange={(e) => { setUf(e.target.value.toUpperCase()); setPagina(1); }}
            />
          </div>
          <div className={styles.filtroGroup}>
            <label className={styles.filtroLabel}>Status</label>
            <select className={styles.select} value={status} onChange={(e) => { setStatus(e.target.value); setPagina(1); }}>
              <option>Todos</option>
              <option>Ativo</option>
              <option>Inativo</option>
            </select>
          </div>
        </div>

        {/* Tabela */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Foto</th>
              <th>Nome</th>
              <th>Função</th>
              <th>UF</th>
              <th>Nascimento</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginados.length === 0 ? (
              <tr><td colSpan={8} className={styles.empty}>Nenhum voluntário encontrado.</td></tr>
            ) : (
              paginados.map((v) => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>
                    <div className={styles.avatar}>
                      {v.foto ? <img src={v.foto} alt={v.nome} /> : <UserCircle2 size={28} color="#adb5bd" />}
                    </div>
                  </td>
                  <td>{v.nome}</td>
                  <td>{v.funcao}</td>
                  <td>{v.uf}</td>
                  <td>{v.nascimento}</td>
                  <td>
                    <span className={`${styles.badge} ${v.status === 'Ativo' ? styles.ativo : styles.inativo}`}>
                      {v.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.acoes}>
                      <button className={styles.btnEditar} onClick={() => onEditar?.(v)}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button className={styles.btnDeletar} onClick={() => onDeletar?.(v)}>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14H6L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4h6v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Paginação */}
        <div className={styles.paginacao}>
          <button className={styles.btnPag} disabled={pagina === 1} onClick={() => setPagina((p) => p - 1)}>
            &lt; Anterior
          </button>
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`${styles.btnPagNum} ${p === pagina ? styles.pagAtiva : ''}`}
              onClick={() => setPagina(p)}
            >
              {p}
            </button>
          ))}
          <button className={styles.btnPag} disabled={pagina === totalPaginas} onClick={() => setPagina((p) => p + 1)}>
            Próximo &gt;
          </button>
        </div>

      </div>
    </div>
  );
};

export default ListVoluntary;
