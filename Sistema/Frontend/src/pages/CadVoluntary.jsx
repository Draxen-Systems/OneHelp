import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL, NIVEL_ACESSO_CODE_TO_LABEL, STATUS_VOLUNTARIO_CODE_TO_LABEL } from "../constants";
import { authFetch } from "../utils/auth";
import styles from "./CadVoluntary.module.css";

const API_URL = `${API_BASE_URL}/api/voluntarios/`;

const CadVoluntary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [erroApi, setErroApi] = useState(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      nome: "",
      cpf: "",
      email: "",
      funcao: "",
      nivel_acesso: "VOLUNTARIO",
      telefone: "",
      endereco: "",
      data_entrada: "",
      login: "",
      senha: "",
      status: "ATIVO",
      observacoes: "",
    },
  });

  // Carrega dados do voluntário em modo edição
  useEffect(() => {
    if (!id) return;

    const carregarVoluntario = async () => {
      try {
        const response = await authFetch(`${API_URL}${id}/`);
        if (!response.ok) throw new Error("Erro ao carregar voluntário.");
        const dados = await response.json();

        reset({
          nome: dados.nome || "",
          cpf: dados.cpf || "",
          email: dados.email || "",
          funcao: dados.funcao || "",
          nivel_acesso: dados.nivel_acesso || "VOLUNTARIO",
          telefone: dados.telefone || "",
          endereco: dados.endereco || "",
          data_entrada: dados.data_entrada || "",
          login: dados.login || "",
          senha: "",
          status: dados.status || "ATIVO",
          observacoes: dados.observacoes || "",
        });
      } catch (err) {
        setErroApi(err.message);
      }
    };

    carregarVoluntario();
  }, [id, reset]);

  const onSubmit = async (data) => {
    setErroApi(null);

    const payload = {
      nome: data.nome,
      cpf: data.cpf,
      email: data.email,
      funcao: data.funcao,
      nivel_acesso: data.nivel_acesso,
      telefone: data.telefone,
      endereco: data.endereco,
      login: data.login,
      observacoes: data.observacoes || "",
    };

    // Tem default no model; só envia se preenchido (string vazia não é data válida)
    if (data.data_entrada) {
      payload.data_entrada = data.data_entrada;
    }

    if (isEditing) {
      payload.status = data.status;
    }

    // Senha so e enviada se preenchida: obrigatoria no cadastro, opcional na edicao
    if (data.senha) {
      payload.senha_hash = data.senha;
    }

    try {
      const url = isEditing ? `${API_URL}${id}/` : API_URL;
      const method = isEditing ? "PATCH" : "POST";

      const response = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const resultado = await response.json();

      if (!response.ok) {
        const mensagens = Object.entries(resultado)
          .map(([campo, erros]) => `${campo}: ${[].concat(erros).join(", ")}`)
          .join("\n");
        setErroApi(mensagens);
        return;
      }

      navigate("/listvoluntary");
    } catch {
      setErroApi("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {isEditing ? "Edição de Voluntário" : "Cadastro de Voluntários"}
      </h1>

      <form className={styles.card} onSubmit={handleSubmit(onSubmit)}>
        {erroApi && <p className={styles.feedbackErro}>{erroApi}</p>}

        <div className={styles.topContent}>
          <section className={styles.formSection}>
            {/* Seção 1 - Dados pessoais */}
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>1</span>
              <span className={styles.sectionTitle}>Dados pessoais</span>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Nome do Voluntário <span className={styles.required}>*</span></label>
                <input type="text" placeholder="Digite o nome completo" {...register("nome")} />
              </div>
              <div className={`${styles.fieldGroup} ${styles.fieldCpf}`}>
                <label>CPF <span className={styles.required}>*</span></label>
                <input type="text" placeholder="___.___.___-__" {...register("cpf")} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Email <span className={styles.required}>*</span></label>
                <input type="email" placeholder="exemplo@gmail.com" {...register("email")} />
              </div>
              <div className={`${styles.fieldGroup} ${styles.fieldTel}`}>
                <label>Telefone</label>
                <input type="text" placeholder="(__)_____-____" {...register("telefone")} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={`${styles.fieldGroup} ${styles.fieldFunc}`}>
                <label>Função <span className={styles.required}>*</span></label>
                <input type="text" placeholder="Ex: Cuidador" {...register("funcao")} />
              </div>
              <div className={`${styles.fieldGroup} ${styles.fieldAcesso}`}>
                <label>Nível de Acesso <span className={styles.required}>*</span></label>
                <select {...register("nivel_acesso")}>
                  {Object.entries(NIVEL_ACESSO_CODE_TO_LABEL).map(([codigo, label]) => (
                    <option key={codigo} value={codigo}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              {isEditing && (
                <div className={styles.fieldGroup}>
                  <label>Status</label>
                  <select {...register("status")}>
                    {Object.entries(STATUS_VOLUNTARIO_CODE_TO_LABEL).map(([codigo, label]) => (
                      <option key={codigo} value={codigo}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Seção 2 - Endereço */}
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>2</span>
              <span className={styles.sectionTitle}>Endereço</span>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Endereço</label>
                <input type="text" placeholder="Rua, número, bairro, cidade, UF" {...register("endereco")} />
              </div>
            </div>

            {/* Seção 3 - Acesso ao sistema */}
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>3</span>
              <span className={styles.sectionTitle}>Acesso ao sistema</span>
            </div>

            <div className={styles.row}>
              <div className={`${styles.fieldGroup} ${styles.fieldNasc}`}>
                <label>Data de Entrada</label>
                <input type="date" {...register("data_entrada")} />
              </div>
              <div className={styles.fieldGroup}>
                <label>Login <span className={styles.required}>*</span></label>
                <input type="text" {...register("login")} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>
                  Senha {!isEditing && <span className={styles.required}>*</span>}
                </label>
                <input
                  type="password"
                  placeholder={isEditing ? "Deixe em branco para manter a atual" : ""}
                  required={!isEditing}
                  {...register("senha")}
                />
              </div>
            </div>
          </section>

          <aside className={styles.mediaSection}>
            <div className={styles.textareaGroup}>
              <label>Observações</label>
              <textarea {...register("observacoes")} rows="22" />
            </div>
          </aside>
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate("/listvoluntary")}
          >
            Voltar para a Lista
          </button>
          <button type="submit" className={styles.saveButton}>
            {isEditing ? "Salvar Alterações" : "Finalizar cadastro"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadVoluntary;
