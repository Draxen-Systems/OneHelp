import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil, Trash2, Plus, PawPrint } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  API_BASE_URL,
  SEXO_CODE_TO_LABEL,
  PORTE_CODE_TO_LABEL,
  STATUS_ANIMAL_CODE_TO_LABEL,
} from "../constants";
import { authFetch } from "../utils/auth";
import { removerAcentos, montarUrlFoto } from "../utils/format";
import styles from "./ListAnimals.module.css";

const API_URL = `${API_BASE_URL}/api/animais/`;
const ESPECIES_URL = `${API_BASE_URL}/api/especies/`;
const RACAS_URL = `${API_BASE_URL}/api/racas/`;

const STATUS_BADGE_CLASS = {
  Disponivel: "badgeDisponivel",
  Tratamento: "badgeTratamento",
  Adotado: "badgeAdotado",
  Obito: "badgeObito",
};

const ListAnimals = () => {
  const [animais, setAnimais] = useState([]);
  const [especies, setEspecies] = useState([]);
  const [racas, setRacas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const navigate = useNavigate();

  const { register, watch } = useForm({
    defaultValues: {
      busca: "",
      especie: "todas",
      raca: "todas",
      sexo: "todos",
      status: "todos",
      porte: "todos",
    },
  });

  const filtros = watch();

  // --- Buscar Animais, Espécies e Raças da API ---
  useEffect(() => {
    const fetchDados = async () => {
      try {
        setLoading(true);
        setErro(null);
        const [respAnimais, respEspecies, respRacas] = await Promise.all([
          authFetch(API_URL),
          authFetch(ESPECIES_URL),
          authFetch(RACAS_URL),
        ]);
        if (!respAnimais.ok) throw new Error("Erro ao buscar animais.");
        if (!respEspecies.ok || !respRacas.ok) {
          throw new Error("Erro ao buscar espécies e raças.");
        }
        setAnimais(await respAnimais.json());
        setEspecies(await respEspecies.json());
        setRacas(await respRacas.json());
      } catch (err) {
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  useEffect(() => {
    if (!sucesso) return;
    const timer = setTimeout(() => setSucesso(null), 3000);
    return () => clearTimeout(timer);
  }, [sucesso]);

  const especiesMap = Object.fromEntries(especies.map((e) => [e.id, e.nome]));
  const racasMap = Object.fromEntries(racas.map((r) => [r.id, r.nome]));

  // --- Lógica de Filtros ---
  const animaisFiltrados = animais.filter((animal) => {
    const buscaLimpa = removerAcentos(filtros.busca);
    const nomeLimpo = removerAcentos(animal.nome);

    const buscaOk =
      !buscaLimpa ||
      nomeLimpo.includes(buscaLimpa) ||
      String(animal.id).includes(buscaLimpa);

    const especieOk =
      filtros.especie === "todas" ||
      String(animal.especie) === String(filtros.especie);

    const racaOk =
      filtros.raca === "todas" || String(animal.raca) === String(filtros.raca);

    const sexoOk = filtros.sexo === "todos" || animal.sexo === filtros.sexo;

    const statusOk = filtros.status === "todos" || animal.status === filtros.status;

    const porteOk = filtros.porte === "todos" || animal.porte === filtros.porte;

    return buscaOk && especieOk && racaOk && sexoOk && statusOk && porteOk;
  });

  // --- Configuração da Paginação ---
  const itensPorPagina = 10;
  const totalPaginas = Math.ceil(animaisFiltrados.length / itensPorPagina);
  const animaisPagina = animaisFiltrados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina,
  );

  // --- Exclusão lógica (DELETE seta ativo=False no backend) ---
  const handleDelete = async (id) => {
    if (!window.confirm("Deseja inativar este animal?")) return;
    try {
      const response = await authFetch(`${API_URL}${id}/`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erro ao inativar animal.");
      setAnimais((prev) => prev.filter((a) => a.id !== id));
      setSucesso("Animal inativado com sucesso.");
    } catch {
      setErro("Erro ao inativar animal.");
    }
  };

  return (
    <div className={styles.containerPrincipal}>
      <div className={styles.wrapperAnimals}>
        {/* --- Header --- */}
        <header className={styles.titleWrapper}>
          <h1>Listagem de Animais</h1>
          <button
            className={styles.btnCadastrar}
            onClick={() => navigate("/cadanimals")}
          >
            Cadastrar Novo Animal <Plus size={18} />
          </button>
        </header>

        {/* --- Filtros --- */}
        <section className={styles.filtersWrapper}>
          <div className={styles.filterGroup}>
            <label>Nome, ID</label>
            <input
              type="text"
              placeholder="Pesquisar..."
              {...register("busca")}
            />
          </div>

          <div className={styles.filterGroup}>
            <label>Espécie</label>
            <select {...register("especie")}>
              <option value="todas">Todas</option>
              {especies.map((especie) => (
                <option key={especie.id} value={especie.id}>
                  {especie.nome}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Raça</label>
            <select {...register("raca")}>
              <option value="todas">Todas</option>
              {racas.map((raca) => (
                <option key={raca.id} value={raca.id}>
                  {raca.nome}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Sexo</label>
            <div className={styles.radioContainer}>
              <label>
                <input type="radio" value="todos" {...register("sexo")} /> Todos
              </label>
              <label>
                <input type="radio" value="M" {...register("sexo")} /> Macho
              </label>
              <label>
                <input type="radio" value="F" {...register("sexo")} /> Fêmea
              </label>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Status</label>
            <select {...register("status")}>
              <option value="todos">Todos</option>
              {Object.entries(STATUS_ANIMAL_CODE_TO_LABEL).map(([codigo, label]) => (
                <option key={codigo} value={codigo}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Porte</label>
            <select {...register("porte")}>
              <option value="todos">Todos</option>
              {Object.entries(PORTE_CODE_TO_LABEL).map(([codigo, label]) => (
                <option key={codigo} value={codigo}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* --- Feedback Visual --- */}
        {sucesso && <p className={styles.feedback} style={{ color: "#2e7d32" }}>{sucesso}</p>}
        {loading && <p className={styles.feedback}>Carregando animais...</p>}
        {erro && <p className={styles.feedbackErro}>{erro}</p>}

        {/* --- Tabela --- */}
        {!loading && !erro && (
          <div className={styles.tableScroll}>
            <table className={styles.animalTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Foto</th>
                  <th>Nome</th>
                  <th>Espécie</th>
                  <th>Raça</th>
                  <th>Sexo</th>
                  <th>PCD</th>
                  <th>Porte</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {animaisPagina.length === 0 ? (
                  <tr>
                    <td colSpan={10} className={styles.semResultados}>
                      Nenhum animal encontrado.
                    </td>
                  </tr>
                ) : (
                  animaisPagina.map((animal) => (
                    <tr key={animal.id}>
                      <td>{animal.id}</td>
                      <td>
                        {animal.foto ? (
                          <img
                            className={styles.animalPhoto}
                            src={montarUrlFoto(animal.foto)}
                            alt={animal.nome}
                          />
                        ) : (
                          <PawPrint size={28} color="#314d41" strokeWidth={1.2} />
                        )}
                      </td>
                      <td>{animal.nome}</td>
                      <td>{especiesMap[animal.especie] || "-"}</td>
                      <td>{racasMap[animal.raca] || "-"}</td>
                      <td>{SEXO_CODE_TO_LABEL[animal.sexo] || animal.sexo}</td>
                      <td>{animal.deficiencias?.length > 0 ? "Sim" : "Não"}</td>
                      <td>{PORTE_CODE_TO_LABEL[animal.porte] || animal.porte}</td>
                      <td>
                        <span
                          className={
                            styles[STATUS_BADGE_CLASS[animal.status]] ||
                            styles.badgeDisponivel
                          }
                        >
                          {STATUS_ANIMAL_CODE_TO_LABEL[animal.status] || animal.status}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            className={styles.btnEdit}
                            aria-label="Editar"
                            onClick={() => navigate(`/cadanimals/${animal.id}`)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className={styles.btnDelete}
                            aria-label="Excluir"
                            onClick={() => handleDelete(animal.id)}
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

export default ListAnimals;
