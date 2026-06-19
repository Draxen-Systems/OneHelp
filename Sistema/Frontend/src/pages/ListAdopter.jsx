import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil, Trash2, Plus, Search, UserCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TIPO_RESIDENCIA_CODE_TO_LABEL, API_BASE_URL } from "../constants";
import { authFetch } from "../utils/auth";
import styles from "./ListAdopter.module.css";

const API_URL = `${API_BASE_URL}/api/adotantes/`;

const apenasNumeros = (str) => str ? str.replace(/\D/g, "") : "";

const ListAdopter = () => {
  const [adotantes, setAdotantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const navigate = useNavigate();

  const { register, watch } = useForm({
    defaultValues: {
      busca: "",
      tipo_residencia: "todas",
      uf: "todas",
      status: "todos",
    },
  });

  const busca = watch("busca") || "";
  const tipoResidencia = watch("tipo_residencia") || "todas";
  const uf = watch("uf") || "todas";
  const statusFilter = watch("status") || "todos";

  useEffect(() => {
    const fetchAdotantes = async () => {
      try {
        setLoading(true);
        setErro(null);
        const response = await authFetch(API_URL);
        if (!response.ok) throw new Error("Erro ao buscar adotantes.");
        const data = await response.json();
        setAdotantes(data);
      } catch (err) {
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdotantes();
  }, []);

  useEffect(() => {
    if (!sucesso) return;
    const timer = setTimeout(() => setSucesso(null), 3000);
    return () => clearTimeout(timer);
  }, [sucesso]);

  const removerAcentos = (str) =>
    str
      ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      : "";

  const formatarData = (dataStr) => {
    if (!dataStr) return "";
    const partes = dataStr.split("-");
    if (partes.length === 3) {
      const [ano, mes, dia] = partes;
      return `${dia}/${mes}/${ano}`;
    }
    return dataStr;
  };

  // UFs extraídas dinamicamente dos dados carregados
  const ufsDisponiveis = [...new Set(
    adotantes.map((a) => a.endereco?.uf).filter(Boolean)
  )].sort();

  const adotantesFiltrados = adotantes.filter((adotante) => {
    const buscaLimpa = removerAcentos(busca);
    const buscaNumerica = apenasNumeros(busca);

    const nomeLimpo = removerAcentos(adotante.nome);
    const cpfNumerico = apenasNumeros(adotante.cpf);

    const buscaOk =
      !buscaLimpa ||
      nomeLimpo.includes(buscaLimpa) ||
      (buscaNumerica && cpfNumerico.includes(buscaNumerica)) ||
      String(adotante.id).includes(buscaLimpa);

    const residenciaOk =
      tipoResidencia === "todas" ||
      adotante.tipo_residencia === tipoResidencia;

    const ufOk =
      uf === "todas" ||
      adotante.endereco?.uf === uf;

    const statusOk =
      statusFilter === "todos" ||
      removerAcentos(adotante.status) === removerAcentos(statusFilter);

    return buscaOk && residenciaOk && ufOk && statusOk;
  });

  const itensPorPagina = 10;
  const totalPaginas = Math.ceil(adotantesFiltrados.length / itensPorPagina);
  const adotantesPagina = adotantesFiltrados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina,
  );

  // RN09: Exclusão lógica
  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente inativar este cliente?")) return;
    try {
      const response = await authFetch(`${API_URL}${id}/`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erro ao inativar cliente.");

      setAdotantes((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "INATIVO" } : a))
      );
      setSucesso("Cliente inativado com sucesso.");
    } catch {
      setErro("Erro ao inativar cliente.");
    }
  };

  const montarUrlFoto = (foto) => {
    if (!foto) return null;
    if (foto.startsWith("http")) return foto;
    return `${API_BASE_URL}${foto}`;
  };

  return (
    <div className={styles.containerPrincipal}>
      <div className={styles.wrapperClientes}>
        <header className={styles.titleWrapper}>
          <h1>Lista de Clientes</h1>
          <button
            className={styles.btnCadastrar}
            onClick={() => navigate("/cadadopter")}
          >
            Cadastrar Novo Cliente <Plus size={18} />
          </button>
        </header>

        <section className={styles.filtersWrapper}>
          <div className={styles.filterGroup}>
            <label>ID, Nome ou CPF</label>
            <div className={styles.searchWrapper}>
              <Search size={16} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Pesquisar..."
                {...register("busca")}
                className={styles.inputWithIcon}
              />
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Tipo de Residência</label>
            <select {...register("tipo_residencia")}>
              <option value="todas">Todas</option>
              <option value="C">Casa</option>
              <option value="A">Apartamento</option>
              <option value="CH">Chácara</option>
              <option value="O">Outro</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>UF</label>
            <select {...register("uf")}>
              <option value="todas">Todas</option>
              {ufsDisponiveis.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Status</label>
            <select {...register("status")}>
              <option value="todos">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
        </section>

        {sucesso && <p className={styles.feedback} style={{ color: "#2e7d32" }}>{sucesso}</p>}
        {loading && <p className={styles.feedback}>A carregar clientes...</p>}
        {erro && <p className={styles.feedbackErro}>{erro}</p>}

        {!loading && !erro && (
          <div className={styles.tableScroll}>
            <table className={styles.clientesTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Foto</th>
                  <th>Nome</th>
                  <th>Residência</th>
                  <th>UF</th>
                  <th>Nascimento</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {adotantesPagina.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={styles.semResultados}>
                      Nenhum cliente encontrado.
                    </td>
                  </tr>
                ) : (
                  adotantesPagina.map((adotante) => (
                    <tr key={adotante.id}>
                      <td>{adotante.id}</td>
                      <td>
                        {adotante.foto ? (
                          <img
                            className={styles.clientePhoto}
                            src={montarUrlFoto(adotante.foto)}
                            alt={adotante.nome}
                          />
                        ) : (
                          <UserCircle2
                            size={44}
                            color="#314d41"
                            strokeWidth={1.2}
                          />
                        )}
                      </td>
                      <td>{adotante.nome}</td>
                      <td>
                        {TIPO_RESIDENCIA_CODE_TO_LABEL[adotante.tipo_residencia] ||
                          adotante.tipo_residencia}
                      </td>
                      <td>{adotante.endereco?.uf}</td>
                      <td>{formatarData(adotante.nascimento)}</td>
                      <td>
                        <span
                          className={
                            adotante.status?.toUpperCase() === "ATIVO"
                              ? styles.badgeAtivo
                              : styles.badgeInativo
                          }
                        >
                          {adotante.status?.toUpperCase() === "ATIVO"
                            ? "Ativo"
                            : "Inativo"}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.btnEdit}
                            aria-label="Editar"
                            onClick={() =>
                              navigate(`/cadadopter/${adotante.id}`)
                            }
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className={styles.btnDelete}
                            aria-label="Excluir"
                            onClick={() => handleDelete(adotante.id)}
                          >
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

        {!loading && !erro && totalPaginas > 1 && (
          <footer className={styles.pagination}>
            <button
              className={styles.navBtn}
              onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
              disabled={paginaAtual === 1}
            >
              &lt; Anterior
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
              (num) => (
                <span
                  key={num}
                  className={
                    num === paginaAtual
                      ? styles.pageItemActive
                      : styles.pageItem
                  }
                  onClick={() => setPaginaAtual(num)}
                >
                  {num}
                </span>
              ),
            )}

            <button
              className={styles.navBtn}
              onClick={() =>
                setPaginaAtual((p) => Math.min(p + 1, totalPaginas))
              }
              disabled={paginaAtual === totalPaginas}
            >
              Próximo &gt;
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};

export default ListAdopter;
