import { useEffect, useState } from "react";
import { UserCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, NIVEL_ACESSO_CODE_TO_LABEL, STATUS_VOLUNTARIO_CODE_TO_LABEL } from "../constants";
import { authFetch } from "../utils/auth";
import { removerAcentos, apenasNumeros, formatarData } from "../utils/format";
import styles from "./ListVoluntary.module.css";

const API_URL = `${API_BASE_URL}/api/voluntarios/`;
const ITEMS_PER_PAGE = 10;

const STATUS_BADGE_CLASS = {
  ATIVO: "ativo",
  INATIVO: "inativo",
  AFASTADO: "afastado",
};

const ListVoluntary = () => {
  const [voluntarios, setVoluntarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);

  const [busca, setBusca] = useState("");
  const [funcao, setFuncao] = useState("Todas");
  const [status, setStatus] = useState("Todos");
  const [pagina, setPagina] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoluntarios = async () => {
      try {
        setLoading(true);
        setErro(null);
        const response = await authFetch(API_URL);
        if (!response.ok) throw new Error("Erro ao buscar voluntários.");
        setVoluntarios(await response.json());
      } catch (err) {
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVoluntarios();
  }, []);

  useEffect(() => {
    if (!sucesso) return;
    const timer = setTimeout(() => setSucesso(null), 3000);
    return () => clearTimeout(timer);
  }, [sucesso]);

  const handleDelete = async (voluntario) => {
    if (!window.confirm("Deseja realmente inativar este voluntário?")) return;
    try {
      const response = await authFetch(`${API_URL}${voluntario.id}/`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erro ao inativar voluntário.");

      setVoluntarios((prev) =>
        prev.map((v) => (v.id === voluntario.id ? { ...v, status: "INATIVO" } : v))
      );
      setSucesso("Voluntário inativado com sucesso.");
    } catch {
      setErro("Erro ao inativar voluntário.");
    }
  };

  const filtrados = voluntarios.filter((v) => {
    const buscaLimpa = removerAcentos(busca);
    const buscaNumerica = apenasNumeros(busca);

    const nomeLimpo = removerAcentos(v.nome);
    const cpfNumerico = apenasNumeros(v.cpf);

    const matchBusca =
      !buscaLimpa ||
      nomeLimpo.includes(buscaLimpa) ||
      (buscaNumerica && cpfNumerico.includes(buscaNumerica)) ||
      String(v.id).includes(buscaLimpa);

    const matchFuncao = funcao === "Todas" || v.funcao === funcao;
    const matchStatus = status === "Todos" || v.status === status;

    return matchBusca && matchFuncao && matchStatus;
  });

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / ITEMS_PER_PAGE));
  const paginados = filtrados.slice((pagina - 1) * ITEMS_PER_PAGE, pagina * ITEMS_PER_PAGE);
  const funcoes = ["Todas", ...Array.from(new Set(voluntarios.map((v) => v.funcao).filter(Boolean)))];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Listas de Voluntários</h1>
        <button className={styles.btnNovo} onClick={() => navigate("/cadvoluntary")}>
          Cadastrar Novo Voluntário +
        </button>
      </div>

      <div className={styles.card}>
        {/* Filtros */}
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
            <label className={styles.filtroLabel}>Status</label>
            <select className={styles.select} value={status} onChange={(e) => { setStatus(e.target.value); setPagina(1); }}>
              <option value="Todos">Todos</option>
              {Object.entries(STATUS_VOLUNTARIO_CODE_TO_LABEL).map(([codigo, label]) => (
                <option key={codigo} value={codigo}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {sucesso && <p className={styles.feedback} style={{ color: "#2e7d32", textAlign: "center", margin: "12px 0" }}>{sucesso}</p>}
        {loading && <p className={styles.feedback} style={{ textAlign: "center", margin: "12px 0" }}>Carregando voluntários...</p>}
        {erro && <p className={styles.feedback} style={{ color: "#c0392b", textAlign: "center", margin: "12px 0" }}>{erro}</p>}

        {!loading && !erro && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th></th>
                <th>Nome</th>
                <th>Função</th>
                <th>Nível de Acesso</th>
                <th>Data de Entrada</th>
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
                        <UserCircle2 size={28} color="#adb5bd" />
                      </div>
                    </td>
                    <td>{v.nome}</td>
                    <td>{v.funcao}</td>
                    <td>{NIVEL_ACESSO_CODE_TO_LABEL[v.nivel_acesso] || v.nivel_acesso}</td>
                    <td>{formatarData(v.data_entrada)}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[STATUS_BADGE_CLASS[v.status]] || styles.ativo}`}>
                        {STATUS_VOLUNTARIO_CODE_TO_LABEL[v.status] || v.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.acoes}>
                        <button className={styles.btnEditar} onClick={() => navigate(`/cadvoluntary/${v.id}`)}>
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button className={styles.btnDeletar} onClick={() => handleDelete(v)}>
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
        )}

        {/* Paginação */}
        {!loading && !erro && totalPaginas > 1 && (
          <div className={styles.paginacao}>
            <button className={styles.btnPag} disabled={pagina === 1} onClick={() => setPagina((p) => p - 1)}>
              &lt; Anterior
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`${styles.btnPagNum} ${p === pagina ? styles.pagAtiva : ""}`}
                onClick={() => setPagina(p)}
              >
                {p}
              </button>
            ))}
            <button className={styles.btnPag} disabled={pagina === totalPaginas} onClick={() => setPagina((p) => p + 1)}>
              Próximo &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListVoluntary;
