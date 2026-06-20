import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Camera } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../constants";
import { authFetch } from "../utils/auth";
import { montarUrlFoto } from "../utils/format";
import styles from "./Cadanimals.module.css";

const API_URL = `${API_BASE_URL}/api/animais/`;
const ESPECIES_URL = `${API_BASE_URL}/api/especies/`;
const RACAS_URL = `${API_BASE_URL}/api/racas/`;
const DEFICIENCIAS_URL = `${API_BASE_URL}/api/deficiencias/`;

const hoje = () => new Date().toISOString().slice(0, 10);

const Cadanimals = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [especies, setEspecies] = useState([]);
  const [racas, setRacas] = useState([]);
  const [deficiencias, setDeficiencias] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [erroApi, setErroApi] = useState(null);

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      nome: "",
      especie: "",
      sexo: "M",
      raca: "",
      ativo: true,
      data_resgate: hoje(),
      porte: "P",
      castrado: false,
      status: "Disponivel",
      pcd: false,
      deficiencia: "",
      observacao: "",
      historia: "",
    },
  });

  // Carrega selects de Espécie, Raça e Deficiência via API
  useEffect(() => {
    const carregarOpcoes = async () => {
      try {
        const [respEspecies, respRacas, respDeficiencias] = await Promise.all([
          authFetch(ESPECIES_URL),
          authFetch(RACAS_URL),
          authFetch(DEFICIENCIAS_URL),
        ]);
        if (!respEspecies.ok || !respRacas.ok || !respDeficiencias.ok) {
          throw new Error("Erro ao carregar espécies, raças e deficiências.");
        }
        setEspecies(await respEspecies.json());
        setRacas(await respRacas.json());
        setDeficiencias(await respDeficiencias.json());
      } catch {
        setErroApi("Erro ao carregar espécies, raças e deficiências.");
      }
    };

    carregarOpcoes();
  }, []);

  // Carrega dados do animal em modo edição
  useEffect(() => {
    if (!id) return;

    const carregarAnimal = async () => {
      try {
        const response = await authFetch(`${API_URL}${id}/`);
        if (!response.ok) throw new Error("Erro ao carregar animal.");
        const dados = await response.json();

        reset({
          nome: dados.nome || "",
          especie: String(dados.especie ?? ""),
          sexo: dados.sexo || "M",
          raca: String(dados.raca ?? ""),
          ativo: dados.ativo,
          data_resgate: dados.data_resgate || "",
          porte: dados.porte || "P",
          castrado: dados.castrado,
          status: dados.status || "Disponivel",
          pcd: dados.deficiencias?.length > 0,
          deficiencia: String(dados.deficiencias?.[0] ?? ""),
          observacao: dados.observacao || "",
          historia: dados.historia || "",
        });

        if (dados.foto) {
          setPreviewImage(montarUrlFoto(dados.foto));
        }
      } catch (err) {
        setErroApi(err.message);
      }
    };

    carregarAnimal();
  }, [id, reset]);

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const especieSelecionada = watch("especie");
  const isAtivo = watch("ativo");
  const isPcd = watch("pcd");
  const racasDaEspecie = racas.filter(
    (r) => String(r.especie) === String(especieSelecionada),
  );

  useEffect(() => {
    if (!isPcd) {
      setValue("deficiencia", "");
    }
  }, [isPcd, setValue]);

  const especieRegister = register("especie");
  const fotoRegister = register("foto");

  const onSubmit = async (data) => {
    setErroApi(null);
    const formData = new FormData();

    formData.append("nome", data.nome);
    formData.append("sexo", data.sexo);
    formData.append("porte", data.porte);
    formData.append("status", data.status);
    formData.append("data_resgate", data.data_resgate);
    formData.append("castrado", data.castrado ? "true" : "false");
    formData.append("historia", data.historia);
    formData.append("observacao", data.observacao || "");
    formData.append("especie", data.especie);
    formData.append("raca", data.raca);
    // Em multipart o DRF trata booleano ausente como False (não aplica o default do model),
    // então "ativo" precisa ser enviado sempre, mesmo no cadastro novo.
    formData.append("ativo", data.ativo ? "true" : "false");

    if (data.pcd && data.deficiencia) {
      formData.append("deficiencias", data.deficiencia);
    }

    if (data.foto?.[0]) {
      formData.append("foto", data.foto[0]);
    }

    try {
      const url = isEditing ? `${API_URL}${id}/` : API_URL;
      const method = isEditing ? "PATCH" : "POST";

      const response = await authFetch(url, { method, body: formData });
      const resultado = await response.json();

      if (!response.ok) {
        const mensagens = Object.entries(resultado)
          .map(([campo, erros]) => `${campo}: ${[].concat(erros).join(", ")}`)
          .join("\n");
        setErroApi(mensagens);
        return;
      }

      navigate("/listanimals");
    } catch {
      setErroApi("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {isEditing ? "Edição de Animal" : "Cadastro de Animais"}
      </h1>

      <form className={styles.card} onSubmit={handleSubmit(onSubmit)}>
        {erroApi && <p className={styles.feedbackErro}>{erroApi}</p>}

        <div className={styles.topContent}>
          <section className={styles.formSection}>
            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label><span className={styles.bullet}>•</span> Nome do Animal</label>
                <input type="text" {...register("nome")} />
              </div>
              <div className={styles.fieldGroup}>
                <label><span className={styles.bullet}>•</span> Espécie</label>
                <select
                  {...especieRegister}
                  onChange={(e) => {
                    especieRegister.onChange(e);
                    setValue("raca", "");
                  }}
                >
                  <option value="">Selecione...</option>
                  {especies.map((especie) => (
                    <option key={especie.id} value={especie.id}>
                      {especie.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label><span className={styles.bullet}>•</span> Sexo</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input type="radio" value="M" {...register("sexo")} /> Macho
                  </label>
                  <label className={styles.radioLabel}>
                    <input type="radio" value="F" {...register("sexo")} /> Fêmea
                  </label>
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label><span className={styles.bullet}>•</span> Raça</label>
                <select {...register("raca")} disabled={!especieSelecionada}>
                  <option value="">Selecione...</option>
                  {racasDaEspecie.map((raca) => (
                    <option key={raca.id} value={raca.id}>
                      {raca.nome}
                    </option>
                  ))}
                </select>
              </div>

              {isEditing && (
                <div className={styles.toggleGroup}>
                  <label className={styles.ativoLabel}>{isAtivo ? "Ativo" : "Desativado"}</label>
                  <label className={styles.switch}>
                    <input type="checkbox" {...register("ativo")} />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              )}
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label><span className={styles.bullet}>•</span> Data do Resgate</label>
                <input type="date" {...register("data_resgate")} />
              </div>

              <div className={styles.fieldGroup}>
                <label><span className={styles.bullet}>•</span> Porte</label>
                <select {...register("porte")}>
                  <option value="P">Pequeno</option>
                  <option value="M">Médio</option>
                  <option value="G">Grande</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label><span className={styles.bullet}>•</span> Status</label>
                <select {...register("status")}>
                  <option value="Disponivel">Disponível</option>
                  <option value="Tratamento">Em Tratamento</option>
                  <option value="Adotado">Adotado</option>
                  <option value="Obito">Óbito</option>
                </select>
              </div>

              <div className={styles.checkboxWrapper}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" {...register("castrado")} /> Castrado
                </label>
              </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.row}>
              <div className={styles.pcdSection}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" {...register("pcd")} /> PCD
                </label>
                <div className={styles.inlineField}>
                  <label>Deficiência</label>
                  <select
                    {...register("deficiencia")}
                    disabled={!isPcd}
                    className={styles.deficienciaInput}
                  >
                    <option value="">Selecione...</option>
                    {deficiencias.map((deficiencia) => (
                      <option key={deficiencia.id} value={deficiencia.id}>
                        {deficiencia.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          <aside className={styles.mediaSection}>
            <div className={styles.imagePreviewContainer}>
              <label htmlFor="uploadFoto" className={styles.imageUploadLabel}>
                <div className={styles.imagePreview}>
                  {previewImage ? (
                    <img src={previewImage} alt="Preview do Animal" />
                  ) : (
                    <div className={styles.placeholderImage}>
                      <Camera size={40} />
                      <span>Clique para enviar foto</span>
                    </div>
                  )}
                </div>
              </label>

              <input
                type="file"
                id="uploadFoto"
                accept="image/*"
                style={{ display: "none" }}
                {...fotoRegister}
                onChange={(e) => {
                  fotoRegister.onChange(e);
                  const file = e.target.files[0];
                  if (file) {
                    if (previewImage && previewImage.startsWith("blob:")) {
                      URL.revokeObjectURL(previewImage);
                    }
                    setPreviewImage(URL.createObjectURL(file));
                  }
                }}
              />
            </div>

            <div className={styles.textareaGroup}>
              <label>Observações</label>
              <textarea {...register("observacao")} rows="6" />
            </div>
          </aside>
        </div>

        <div className={styles.historySection}>
          <label><span className={styles.bullet}>•</span> História do Animal</label>
          <textarea {...register("historia")} className={styles.historyTextarea} />
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate("/listanimals")}
          >
            Voltar para a Lista
          </button>
          <button type="submit" className={styles.saveButton}>
            {isEditing ? "Salvar Alterações" : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Cadanimals;
