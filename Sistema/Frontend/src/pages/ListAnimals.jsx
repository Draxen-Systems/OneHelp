import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pencil, Trash2, Plus } from "lucide-react";
import styles from "./ListAnimals.module.css";

const API_URL = "http://localhost:3001/animais";

const ListAnimals = () => {
  const [animais, setAnimais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);

  const { register, watch } = useForm({
    defaultValues: {
      busca: "",
      especie: "todas",
      sexo: "todos",
      status: "todos",
      porte: "todos",
    },
  });

  const filtros = watch();

  // --- Buscar Animais da API ---
  useEffect(() => {
    const fetchAnimais = async () => {
      try {
        setLoading(true);
        setErro(null);
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro ao buscar animais.");
        const data = await response.json();
        setAnimais(data);
      } catch (err) {
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimais();
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
  const animaisFiltrados = animais.filter((animal) => {
    const buscaLimpa = removerAcentos(filtros.busca);
    const nomeLimpo = removerAcentos(animal.nome);

    const buscaOk =
      !buscaLimpa ||
      nomeLimpo.includes(buscaLimpa) ||
      String(animal.id).includes(buscaLimpa);

    const especieOk =
      filtros.especie === "todas" ||
      removerAcentos(animal.especie) === removerAcentos(filtros.especie);

    const sexoOk =
      filtros.sexo === "todos" ||
      removerAcentos(animal.sexo) === removerAcentos(filtros.sexo);

    const statusOk =
      filtros.status === "todos" ||
      removerAcentos(animal.status).includes(removerAcentos(filtros.status));

    const porteOk =
      filtros.porte === "todos" ||
      removerAcentos(animal.porte) === removerAcentos(filtros.porte);

    return buscaOk && especieOk && sexoOk && statusOk && porteOk;
  });

  // --- Configuração da Paginação ---
  const itensPorPagina = 10;
  const totalPaginas = Math.ceil(animaisFiltrados.length / itensPorPagina);
  const animaisPagina = animaisFiltrados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina,
  );

  // --- Excluir Animal ---
  const handleDelete = async (id) => {
    if (!window.confirm("Deseja excluir este animal?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setAnimais((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Erro ao excluir animal.");
    }
  };

  return (
    <div className={styles.containerPrincipal}>
      <div className={styles.wrapperAnimals}>
        {/* --- Header --- */}
        <header className={styles.titleWrapper}>
          <h1>Listagem de Animais</h1>
          <button className={styles.btnCadastrar}>
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
              <option value="cachorro">Cachorro</option>
              <option value="gato">Gato</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Sexo</label>
            <div className={styles.radioContainer}>
              <label>
                <input type="radio" value="todos" {...register("sexo")} /> Todos
              </label>
              <label>
                <input type="radio" value="macho" {...register("sexo")} /> Macho
              </label>
              <label>
                <input type="radio" value="femea" {...register("sexo")} /> Fêmea
              </label>
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label>Status</label>
            <select {...register("status")}>
              <option value="todos">Todos</option>
              <option value="adocao">Para Adoção</option>
              <option value="adotado">Adotado</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Porte</label>
            <select {...register("porte")}>
              <option value="todos">Todos</option>
              <option value="pequeno">Pequeno</option>
              <option value="medio">Médio</option>
              <option value="grande">Grande</option>
            </select>
          </div>
        </section>

        {/* --- Feedback Visual --- */}
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
                    <td colSpan={9} className={styles.semResultados}>
                      Nenhum animal encontrado.
                    </td>
                  </tr>
                ) : (
                  animaisPagina.map((animal) => (
                    <tr key={animal.id}>
                      <td>{animal.id}</td>
                      <td>
                        <img
                          className={styles.animalPhoto}
                          src={animal.foto}
                          alt={animal.nome}
                        />
                      </td>
                      <td>{animal.nome}</td>
                      <td>{animal.especie}</td>
                      <td>{animal.sexo}</td>
                      <td>{animal.pcd ?? "Não"}</td>
                      <td>{animal.porte}</td>
                      <td>
                        <span className={styles.badgeAdocao}>
                          {animal.status}
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
                            onClick={() => handleDelete(animal.id)}>
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
