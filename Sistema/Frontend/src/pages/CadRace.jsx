import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil, Trash2, Search, Save, X } from "lucide-react";
import { API_BASE_URL } from "../constants";
import { authFetch } from "../utils/auth";
import { removerAcentos } from "../utils/format";
import styles from "./CadRace.module.css";

const API_URL = `${API_BASE_URL}/api/racas/`;
const ESPECIES_URL = `${API_BASE_URL}/api/especies/`;

const CadRace = () => {
  const [racas, setRacas] = useState([]);
  const [especies, setEspecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idEditando, setIdEditando] = useState(null);
  
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);

  // Form de busca/filtro
  const { register: registerFiltro, watch: watchFiltro } = useForm({
    defaultValues: { busca: "", filtroEspecie: "todas" }
  });
  const busca = watchFiltro("busca") || "";
  const filtroEspecie = watchFiltro("filtroEspecie") || "todas";

  // Form de cadastro/edição
  const { register: registerCadastro, handleSubmit: handleSubmitCadastro, reset: resetCadastro, setValue: setValorCadastro } = useForm({
    defaultValues: { nome: "", especie: "" }
  });

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [respRacas, respEspecies] = await Promise.all([
        authFetch(API_URL),
        authFetch(ESPECIES_URL)
      ]);

      if (!respRacas.ok || !respEspecies.ok) throw new Error("Erro ao buscar dados do servidor.");
      
      setRacas(await respRacas.json());
      setEspecies(await respEspecies.json());
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (!sucesso) return;
    const timer = setTimeout(() => setSucesso(null), 3000);
    return () => clearTimeout(timer);
  }, [sucesso]);

  const onSalvarRaca = async (data) => {
    setErro(null);
    try {
      const url = idEditando ? `${API_URL}${idEditando}/` : API_URL;
      const method = idEditando ? "PATCH" : "POST";

      const response = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: data.nome,
          especie: data.especie
        })
      });

      if (!response.ok) throw new Error("Erro ao salvar a raça no banco.");

      setSucesso(idEditando ? "Raça atualizada com sucesso!" : "Raça cadastrada com sucesso!");
      setIdEditando(null);
      resetCadastro({ nome: "", especie: "" });
      carregarDados();
    } catch (err) {
      setErro(err.message);
    }
  };

  const handleEditClick = (raca) => {
    setIdEditando(raca.id);
    const especieId = typeof raca.especie === "object" ? raca.especie?.id : raca.especie;
    setValorCadastro("nome", raca.nome);
    setValorCadastro("especie", String(especieId || ""));
  };

  const cancelEdicao = () => {
    setIdEditando(null);
    resetCadastro({ nome: "", especie: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta raça?")) return;
    try {
      const response = await authFetch(`${API_URL}${id}/`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erro ao excluir raça.");

      setSucesso("Raça excluída com sucesso.");
      carregarDados();
    } catch (err) {
      setErro(err.message);
    }
  };

  const racasFiltradas = racas.filter((raca) => {
    const buscaLimpa = removerAcentos(busca);
    const nomeRacaLimpo = removerAcentos(raca.nome || "");
    
    const objEspecie = typeof raca.especie === "object" ? raca.especie?.nome : especies.find(e => String(e.id) === String(raca.especie))?.nome;
    const nomeEspecie = objEspecie || "";

    const buscaOk = !buscaLimpa || nomeRacaLimpo.includes(buscaLimpa) || String(raca.id).includes(buscaLimpa);
    const especieOk = filtroEspecie === "todas" || removerAcentos(nomeEspecie) === removerAcentos(filtroEspecie);

    return buscaOk && especieOk;
  });

  const itensPorPagina = 10;
  const totalPaginas = Math.ceil(racasFiltradas.length / itensPorPagina);
  const racasPagina = racasFiltradas.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

  const nomesEspeciesDisponiveis = [...new Set(especies.map(e => e.nome).filter(Boolean))].sort();

  return (
    <div className={styles.containerPrincipal}>
      <div className={styles.wrapperClientes}>
        
        <header className={styles.titleWrapper}>
          <h1>Gerenciamento de Raças</h1>
        </header>

        {/* BLOCO ÚNICO INTEGRADO: CADASTRO (ESQUERDA) + BUSCA (DIREITA) */}
        <div className={styles.filtersWrapper}>
          
          {/* Form de Cadastro / Edição */}
          <form onSubmit={handleSubmitCadastro(onSalvarRaca)} style={{ display: "flex", gap: "20px", flex: "3", alignItems: "flex-end", flexWrap: "wrap" }}>
            <div className={styles.filterGroup}>
              <label style={{ color: idEditando ? "#ff8c61" : "#314d41" }}>
                {idEditando ? "Editar Nome da Raça" : "Nova Raça"}
              </label>
              <input type="text" placeholder="Ex: Labrador, Siamês..." {...registerCadastro("nome", { required: true })} />
            </div>

            <div className={styles.filterGroup}>
              <label>Espécie Vinculada</label>
              <select {...registerCadastro("especie", { required: true })}>
                <option value="">Selecione...</option>
                {especies.map((esp) => (
                  <option key={esp.id} value={esp.id}>{esp.nome}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button type="submit" className={styles.btnCadastrar} style={{ height: "42px", borderRadius: "12px", padding: "0 20px" }}>
                {idEditando ? "Atualizar" : "Salvar"} <Save size={16} />
              </button>
              {idEditando && (
                <button type="button" className={styles.btnDelete} style={{ height: "42px", width: "42px", borderRadius: "12px" }} onClick={cancelEdicao} title="Cancelar edição">
                  <X size={16} />
                </button>
              )}
            </div>
          </form>

          {/* Linha Fina Divisória entre Cadastro e Busca */}
          <div style={{ width: "2px", backgroundColor: "#314d41", opacity: 0.15, alignSelf: "stretch", margin: "0 10px" }} />

          {/* Filtros de Pesquisa */}
          <div style={{ display: "flex", gap: "20px", flex: "2", alignItems: "flex-end", flexWrap: "wrap" }}>
            <div className={styles.filterGroup}>
              <label>Buscar na Lista</label>
              <div className={styles.searchWrapper}>
                <Search size={16} className={styles.searchIcon} />
                <input type="text" placeholder="Nome ou ID..." {...registerFiltro("busca")} className={styles.inputWithIcon} />
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label>Filtrar por Espécie</label>
              <select {...registerFiltro("filtroEspecie")}>
                <option value="todas">Todas</option>
                {nomesEspeciesDisponiveis.map((esp) => (
                  <option key={esp} value={esp}>{esp}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {sucesso && <p className={styles.feedback} style={{ color: "#2e7d32", fontWeight: "bold", padding: "10px 0" }}>{sucesso}</p>}
        {loading && <p className={styles.feedback}>Carregando dados do banco...</p>}
        {erro && <p className={styles.feedbackErro}>{erro}</p>}

        {!loading && (
          <div className={styles.tableScroll}>
            <table className={styles.clientesTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome da Raça</th>
                  <th>Espécie</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {racasPagina.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={styles.semResultados}>Nenhuma raça encontrada.</td>
                  </tr>
                ) : (
                  racasPagina.map((raca) => {
                    const labelEspecie = typeof raca.especie === "object" 
                      ? raca.especie?.nome 
                      : especies.find(e => String(e.id) === String(raca.especie))?.nome;

                    return (
                      <tr key={raca.id}>
                        <td>{raca.id}</td>
                        <td>{raca.nome}</td>
                        <td>{labelEspecie || "Não informada"}</td>
                        <td>
                          <div className={styles.actionButtons}>
                            <button className={styles.btnEdit} aria-label="Editar" onClick={() => handleEditClick(raca)}>
                              <Pencil size={16} />
                            </button>
                            <button className={styles.btnDelete} aria-label="Excluir" onClick={() => handleDelete(raca.id)}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && totalPaginas > 1 && (
          <footer className={styles.pagination}>
            <button className={styles.navBtn} onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))} disabled={paginaAtual === 1}>
              &lt; Anterior
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
              <span key={num} className={num === paginaAtual ? styles.pageItemActive : styles.pageItem} onClick={() => setPaginaAtual(num)}>
                {num}
              </span>
            ))}
            <button className={styles.navBtn} onClick={() => setPaginaAtual((p) => Math.min(p + 1, totalPaginas))} disabled={paginaAtual === totalPaginas}>
              Próximo &gt;
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};

export default CadRace;