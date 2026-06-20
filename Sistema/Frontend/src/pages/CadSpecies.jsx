import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil, Trash2, Search, Save, X } from "lucide-react";
import { API_BASE_URL } from "../constants";
import { authFetch } from "../utils/auth";
import { removerAcentos } from "../utils/format";
import styles from "./CadSpecies.module.css";

const API_URL = `${API_BASE_URL}/api/especies/`;

const CadSpecies = () => {
  const [especies, setEspecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idEditando, setIdEditando] = useState(null);
  
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);

  // Form de Busca
  const { register: registerFiltro, watch: watchFiltro } = useForm({
    defaultValues: { busca: "" }
  });
  const busca = watchFiltro("busca") || "";

  // Form de Cadastro/Edição
  const { register: registerCadastro, handleSubmit: handleSubmitCadastro, reset: resetCadastro, setValue: setValorCadastro } = useForm({
    defaultValues: { nome: "" }
  });

  const carregarEspecies = async () => {
    try {
      setLoading(true);
      const response = await authFetch(API_URL);
      if (!response.ok) throw new Error("Erro ao buscar espécies.");
      setEspecies(await response.json());
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEspecies();
  }, []);

  useEffect(() => {
    if (!sucesso) return;
    const timer = setTimeout(() => setSucesso(null), 3000);
    return () => clearTimeout(timer);
  }, [sucesso]);

  const onSalvarEspecie = async (data) => {
    setErro(null);
    try {
      const url = idEditando ? `${API_URL}${idEditando}/` : API_URL;
      const method = idEditando ? "PATCH" : "POST";

      const response = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: data.nome })
      });

      if (!response.ok) throw new Error("Erro ao salvar a espécie.");

      setSucesso(idEditando ? "Espécie atualizada com sucesso!" : "Espécie cadastrada com sucesso!");
      setIdEditando(null);
      resetCadastro({ nome: "" });
      carregarEspecies();
    } catch (err) {
      setErro(err.message);
    }
  };

  const handleEditClick = (especie) => {
    setIdEditando(especie.id);
    setValorCadastro("nome", especie.nome);
  };

  const cancelEdicao = () => {
    setIdEditando(null);
    resetCadastro({ nome: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta espécie?")) return;
    try {
      const response = await authFetch(`${API_URL}${id}/`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erro ao excluir espécie.");

      setSucesso("Espécie excluída com sucesso.");
      carregarEspecies();
    } catch (err) {
      setErro(err.message);
    }
  };

  const especiesFiltradas = especies.filter((especie) => {
    const buscaLimpa = removerAcentos(busca);
    const nomeEspecieLimpo = removerAcentos(especie.nome || "");

    return !buscaLimpa || nomeEspecieLimpo.includes(buscaLimpa) || String(especie.id).includes(buscaLimpa);
  });

  const itensPorPagina = 10;
  const totalPaginas = Math.ceil(especiesFiltradas.length / itensPorPagina);
  const especiesPagina = especiesFiltradas.slice((paginaAtual - 1) * itensPorPagina, paginaAtual * itensPorPagina);

  return (
    <div className={styles.containerPrincipal}>
      <div className={styles.wrapperClientes}>
        
        <header className={styles.titleWrapper}>
          <h1>Gerenciamento de Espécies</h1>
        </header>

        {/* BLOCO ÚNICO INTEGRADO: CADASTRO (ESQUERDA) + BUSCA (DIREITA) */}
        <div className={styles.filtersWrapper}>
          
          {/* Form de Cadastro / Edição */}
          <form onSubmit={handleSubmitCadastro(onSalvarEspecie)} style={{ display: "flex", gap: "20px", flex: "1", alignItems: "flex-end" }}>
            <div className={styles.filterGroup}>
              <label style={{ color: idEditando ? "#ff8c61" : "#314d41" }}>
                {idEditando ? "Editar Nome da Espécie" : "Nova Espécie"}
              </label>
              <input type="text" placeholder="Ex: Gato, Cachorro, Ave..." {...registerCadastro("nome", { required: true })} />
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
          <div style={{ width: "2px", backgroundColor: "#314d41", opacity: 0.15, alignSelf: "stretch", margin: "0 15px" }} />

          {/* Filtros de Pesquisa */}
          <div style={{ display: "flex", gap: "20px", flex: "1", alignItems: "flex-end" }}>
            <div className={styles.filterGroup}>
              <label>Buscar na Lista</label>
              <div className={styles.searchWrapper}>
                <Search size={16} className={styles.searchIcon} />
                <input type="text" placeholder="Filtrar por nome ou ID..." {...registerFiltro("busca")} className={styles.inputWithIcon} />
              </div>
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
                  <th>Nome da Espécie</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {especiesPagina.length === 0 ? (
                  <tr>
                    <td colSpan={3} className={styles.semResultados}>Nenhuma espécie encontrada.</td>
                  </tr>
                ) : (
                  especiesPagina.map((especie) => (
                    <tr key={especie.id}>
                      <td>{especie.id}</td>
                      <td>{especie.nome}</td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button className={styles.btnEdit} aria-label="Editar" onClick={() => handleEditClick(especie)}>
                            <Pencil size={16} />
                          </button>
                          <button className={styles.btnDelete} aria-label="Excluir" onClick={() => handleDelete(especie.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
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

export default CadSpecies;