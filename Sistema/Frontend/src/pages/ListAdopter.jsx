import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./ListAdopter.module.css";

const API_URL = "http://localhost:3001/clientes";

const ListAdopter = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
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

  const filtros = watch();

  // --- Buscar Clientes da API ---
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true);
        setErro(null);
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro ao buscar clientes.");
        const data = await response.json();
        setClientes(data);
      } catch (err) {
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  // --- Remover Acentos ---
  const removerAcentos = (str) => {
    return str
      ? str
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
      : "";
  };

  // --- Lógica de Filtros ---
  const clientesFiltrados = clientes.filter((cliente) => {
    const buscaLimpa = removerAcentos(filtros.busca);
    const nomeLimpo = removerAcentos(cliente.nome_cliente);
    const cpfLimpo = removerAcentos(cliente.cpf);

    // Busca unificada por ID, Nome ou CPF
    const buscaOk =
      !buscaLimpa ||
      nomeLimpo.includes(buscaLimpa) ||
      cpfLimpo.includes(buscaLimpa) ||
      String(cliente.id).includes(buscaLimpa);

    const residenciaOk =
      filtros.tipo_residencia === "todas" ||
      removerAcentos(cliente.tipo_residencia) ===
        removerAcentos(filtros.tipo_residencia);

    const ufOk =
      filtros.uf === "todas" ||
      removerAcentos(cliente.uf) === removerAcentos(filtros.uf);

    const statusOk =
      filtros.status === "todos" ||
      removerAcentos(cliente.status) === removerAcentos(filtros.status);

    return buscaOk && residenciaOk && ufOk && statusOk;
  });

  // --- Configuração da Paginação ---
  const itensPorPagina = 10;
  const totalPaginas = Math.ceil(clientesFiltrados.length / itensPorPagina);
  const clientesPagina = clientesFiltrados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina,
  );

  // --- Excluir Cliente ---
  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir este cliente?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setClientes((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Erro ao excluir cliente.");
    }
  };

  return (
    <div className={styles.containerPrincipal}>
      <div className={styles.wrapperClientes}>
        {/* --- Header --- */}
        <header className={styles.titleWrapper}>
          <h1>Lista de Clientes</h1>
          <button className={styles.btnCadastrar} onClick={() => navigate("/")}>
            Cadastrar Novo Cliente <Plus size={18} />
          </button>
        </header>

        {/* --- Filtros --- */}
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
              <option value="casa">Casa</option>
              <option value="apartamento">Apartamento</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>UF</label>
            <select {...register("uf")}>
              <option value="todas">Todas</option>
              <option value="sp">SP</option>
              <option value="mg">MG</option>
              <option value="rj">RJ</option>
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

        {/* --- Feedback Visual --- */}
        {loading && <p className={styles.feedback}>A carregar clientes...</p>}
        {erro && <p className={styles.feedbackErro}>{erro}</p>}

        {/* --- Tabela --- */}
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
                {clientesPagina.length === 0 ? (
                  <tr>
                    <td colSpan={8} className={styles.semResultados}>
                      Nenhum cliente encontrado.
                    </td>
                  </tr>
                ) : (
                  clientesPagina.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>{cliente.id}</td>
                      <td>
                        <img
                          className={styles.clientePhoto}
                          src={
                            cliente.foto_cliente ||
                            "https://via.placeholder.com/44"
                          }
                          alt={cliente.nome_cliente}
                        />
                      </td>
                      <td>{cliente.nome_cliente}</td>
                      <td style={{ textTransform: "capitalize" }}>
                        {cliente.tipo_residencia}
                      </td>
                      <td>{cliente.uf}</td>
                      <td>{cliente.data_nascimento}</td>
                      <td>
                        <span
                          className={
                            cliente.status.toLowerCase() === "ativo"
                              ? styles.badgeAtivo
                              : styles.badgeInativo
                          }>
                          {cliente.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.btnEdit}
                            aria-label="Editar">
                            <Pencil size={16} />
                          </button>
                          <button
                            className={styles.btnDelete}
                            aria-label="Excluir"
                            onClick={() => handleDelete(cliente.id)}>
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

        {/* --- Paginação --- */}
        {!loading && !erro && totalPaginas > 1 && (
          <footer className={styles.pagination}>
            <button
              className={styles.navBtn}
              onClick={() => setPaginaAtual((p) => Math.max(p - 1, 1))}
              disabled={paginaAtual === 1}>
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
                  onClick={() => setPaginaAtual(num)}>
                  {num}
                </span>
              ),
            )}

            <button
              className={styles.navBtn}
              onClick={() =>
                setPaginaAtual((p) => Math.min(p + 1, totalPaginas))
              }
              disabled={paginaAtual === totalPaginas}>
              Próximo &gt;
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};

export default ListAdopter;
