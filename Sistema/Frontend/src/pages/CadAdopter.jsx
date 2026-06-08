import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Upload } from "lucide-react";
import styles from "./CadAdopter.module.css";

const CadAdopter = () => {
  const [previewImage, setPreviewImage] = useState(null);

  const { register, handleSubmit, watch, setValue } = useForm({
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
    },
  });

  useEffect(() => {
    return () => {
      if (previewImage) {
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
    const formData = new FormData();

    formData.append("nome", data.nome);
    formData.append("cpf", data.cpf);
    formData.append("telefone", data.telefone);
    formData.append("email", data.email);
    formData.append("nascimento", data.nascimento);

    formData.append("pessoas", Number(data.pessoasFamilia));

    const tipoResidenciaMap = {
      Casa: "C",
      Apartamento: "A",
      Chácara: "CH",
    };

    formData.append("tipo_residencia", tipoResidenciaMap[data.tipoResidencia]);

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
    try {
      const response = await fetch("http://127.0.0.1:8000/api/adotantes/", {
        method: "POST",
        body: formData,
      });

      const resultado = await response.json();

      console.log(resultado);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cadastro de Clientes</h1>

      <form className={styles.card} onSubmit={handleSubmit(onSubmit)}>
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
                <input type="number" min="0" {...register("pessoasFamilia")} />
              </div>
              <div className={styles.fieldGroup}>
                <label>Tipo de Residência</label>
                <select {...register("tipoResidencia")}>
                  <option value="Casa">Casa</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Chácara">Chácara</option>
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
                    if (previewImage) {
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
          <button type="button" className={styles.backButton}>
            Voltar para a Lista
          </button>
          <button type="submit" className={styles.saveButton}>
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CadAdopter;
