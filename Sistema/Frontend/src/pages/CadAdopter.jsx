import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Upload } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TIPO_RESIDENCIA_LABEL_TO_CODE,
  TIPO_RESIDENCIA_CODE_TO_LABEL,
  API_BASE_URL,
} from "../constants";
import { authFetch } from "../utils/auth";
import styles from "./CadAdopter.module.css";

const API_URL = `${API_BASE_URL}/api/adotantes/`;

const CadAdopter = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [previewImage, setPreviewImage] = useState(null);
  const [erroApi, setErroApi] = useState(null);

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      nome: "",
      cpf: "",
      nascimento: "",
      email: "",
      pessoasFamilia: 0,
      tipoResidencia: "Casa",
      telefone: "",
      pcd: false,
      deficiencia: "",
      cep: "",
      endereco: "",
      bairro: "",
      uf: "",
      numero: "",
      observacoes: "",
      status: true,
    },
  });

  // Carrega dados do adotante em modo edição
  useEffect(() => {
    if (!id) return;

    const carregarAdotante = async () => {
      try {
        const response = await authFetch(`${API_URL}${id}/`);
        if (!response.ok) throw new Error("Erro ao carregar adotante.");
        const dados = await response.json();

        // Converte nascimento YYYY-MM-DD → DD/MM/AAAA
        let nascimentoFormatado = dados.nascimento || "";
        if (nascimentoFormatado.includes("-")) {
          const [ano, mes, dia] = nascimentoFormatado.split("-");
          nascimentoFormatado = `${dia}/${mes}/${ano}`;
        }

        const tipoLabel =
          TIPO_RESIDENCIA_CODE_TO_LABEL[dados.tipo_residencia] || "Casa";

        reset({
          nome: dados.nome || "",
          cpf: dados.cpf || "",
          nascimento: nascimentoFormatado,
          email: dados.email || "",
          pessoasFamilia: dados.pessoas || 0,
          tipoResidencia: tipoLabel,
          telefone: dados.telefone || "",
          pcd: dados.deficiencias?.length > 0,
          deficiencia: dados.deficiencias?.[0] || "",
          cep: dados.endereco?.cep || "",
          endereco: dados.endereco?.rua || "",
          bairro: dados.endereco?.bairro || "",
          uf: dados.endereco?.uf || "",
          numero: dados.endereco?.numero || "",
          observacoes: dados.observacoes || "",
          status: dados.status?.toUpperCase() === "ATIVO",
        });

        if (dados.foto) {
          const urlFoto = dados.foto.startsWith("http")
            ? dados.foto
            : `${API_BASE_URL}${dados.foto}`;
          setPreviewImage(urlFoto);
        }
      } catch (err) {
        setErroApi(err.message);
      }
    };

    carregarAdotante();
  }, [id, reset]);

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const isPcd = watch("pcd");
  useEffect(() => {
    if (!isPcd) {
      setValue("deficiencia", "");
    }
  }, [isPcd, setValue]);
  const fotoRegister = register("foto");

  const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) return;

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`,
      );

      const endereco = await response.json();

      if (endereco.erro) {
        return;
      }

      setValue("endereco", endereco.logradouro || "");
      setValue("bairro", endereco.bairro || "");
      setValue("uf", endereco.uf || "");
    } catch (error) {
      console.error("Erro ao consultar CEP:", error);
    }
  };

  const onSubmit = async (data) => {
    setErroApi(null);
    const formData = new FormData();

    formData.append("nome", data.nome);
    formData.append("cpf", data.cpf);
    formData.append("telefone", data.telefone);
    formData.append("email", data.email);
    formData.append("nascimento", data.nascimento);

    formData.append("pessoas", Number(data.pessoasFamilia));

    formData.append(
      "tipo_residencia",
      TIPO_RESIDENCIA_LABEL_TO_CODE[data.tipoResidencia] || "C",
    );

    formData.append("observacoes", data.observacoes || "");

    formData.append("endereco.rua", data.endereco);
    formData.append("endereco.bairro", data.bairro);
    formData.append("endereco.uf", data.uf);
    formData.append("endereco.numero", data.numero);
    formData.append("endereco.cep", data.cep);

    if (data.pcd && data.deficiencia) {
      formData.append("deficiencias", data.deficiencia);
    }

    if (data.foto?.[0]) {
      formData.append("foto", data.foto[0]);
    }

    if (isEditing) {
      formData.append("status", data.status ? "ATIVO" : "INATIVO");
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

      navigate("/listadopter");
    } catch (error) {
      setErroApi("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {isEditing ? "Edição de Cliente" : "Cadastro de Clientes"}
      </h1>

      <form className={styles.card} onSubmit={handleSubmit(onSubmit)}>
        {erroApi && <p className={styles.feedbackErro}>{erroApi}</p>}

        <div className={styles.topContent}>
          <section className={styles.formSection}>
            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Nome do Cliente</label>
                <input type="text" {...register("nome")} />
              </div>
              <div className={styles.fieldGroup}>
                <label>CPF</label>
                <input
                  type="text"
                  placeholder="___.___.___-__"
                  {...register("cpf")}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Nascimento</label>
                <input
                  type="text"
                  placeholder="00/00/0000"
                  {...register("nascimento")}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Email</label>
                <input type="email" {...register("email")} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Pessoas na Família</label>
                <input
                  type="number"
                  min="0"
                  {...register("pessoasFamilia")}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Tipo de Residência</label>
                <select {...register("tipoResidencia")}>
                  <option value="Casa">Casa</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Chácara">Chácara</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label>Telefone</label>
                <input
                  type="text"
                  placeholder="(__)_____-____"
                  {...register("telefone")}
                />
              </div>
            </div>

            {isEditing && (
              <div className={styles.row}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" {...register("status")} /> Adotante ativo
                </label>
              </div>
            )}

            <hr className={styles.divider} />

            <div className={styles.row}>
              <div className={styles.pcdSection}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" {...register("pcd")} /> PCD
                </label>
                <div className={styles.inlineField}>
                  <label>Deficiência</label>
                  <input
                    type="text"
                    {...register("deficiencia")}
                    disabled={!isPcd}
                    className={styles.deficienciaInput}
                  />
                </div>
              </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>CEP</label>
                <input
                  type="text"
                  placeholder="00000-000"
                  {...register("cep")}
                  onBlur={(e) => buscarCep(e.target.value)}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Endereço</label>
                <input type="text" {...register("endereco")} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Bairro</label>
                <input type="text" {...register("bairro")} />
              </div>
              <div className={styles.fieldGroup}>
                <label>UF</label>
                <input type="text" maxLength="2" {...register("uf")} />
              </div>
              <div className={styles.fieldGroup}>
                <label>Número</label>
                <input type="text" {...register("numero")} />
              </div>
            </div>
          </section>

          <aside className={styles.mediaSection}>
            <div className={styles.imagePreviewContainer}>
              <label htmlFor="uploadFoto" className={styles.imageUploadLabel}>
                <div className={styles.imagePreview}>
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" />
                  ) : (
                    <div className={styles.placeholderImage}>
                      <Upload size={64} color="#4B5563" />
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
              <textarea {...register("observacoes")} rows="6" />
            </div>
          </aside>
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => navigate("/listadopter")}
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

export default CadAdopter;
