import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Save, User } from "lucide-react";
import { API_BASE_URL } from "../constants";
import { authFetch, getUsuario } from "../utils/auth";
import styles from "./PerfilPage.module.css";

const PerfilPage = () => {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const [userId, setUserId] = useState(null);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      login: "" // O backend do seu sistema usa "login" e não "username"
    }
  });

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        setLoading(true);
        setErro(null);

        // 1. Pega os dados básicos que o auth.js salvou no login para descobrir o ID
        const usuarioLogado = getUsuario();
        
        if (!usuarioLogado || !usuarioLogado.id) {
          throw new Error("Não foi possível identificar o ID do usuário logado.");
        }

        setUserId(usuarioLogado.id);
        const url_voluntario = `${API_BASE_URL}/api/voluntarios/${usuarioLogado.id}/`;

        // 2. Busca os dados mais atualizados direto do banco
        const response = await authFetch(url_voluntario);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || "Erro ao carregar dados do perfil do banco.");
        }
        
        const dados = await response.json();
        
        // 3. Preenche os campos da tela
        reset({
          nome: dados.nome || "",
          email: dados.email || "",
          telefone: dados.telefone || "",
          login: dados.login || usuarioLogado.login || "" 
        });

      } catch (err) {
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    };

    carregarPerfil();
  }, [reset]);

  useEffect(() => {
    if (!sucesso) return;
    const timer = setTimeout(() => setSucesso(null), 3000);
    return () => clearTimeout(timer);
  }, [sucesso]);

  const onSalvarPerfil = async (data) => {
    setErro(null);
    try {
      if (!userId) throw new Error("ID de usuário inválido.");

      const response = await authFetch(`${API_BASE_URL}/api/voluntarios/${userId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
         const errorData = await response.json().catch(() => ({}));
         throw new Error(errorData.detail || "Erro ao atualizar perfil no servidor.");
      }
      
      setSucesso("Perfil atualizado com sucesso!");
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <div className={styles.containerPrincipal}>
      <div className={styles.wrapperPerfil}>
        <header className={styles.titleWrapper}>
          <h1>Meu Perfil</h1>
        </header>

        {loading && <p className={styles.feedback}>Carregando suas informações...</p>}
        {erro && <p className={styles.feedbackErro}>{erro}</p>}
        {sucesso && <p className={styles.feedbackSucesso}>{sucesso}</p>}

        {!loading && !erro && (
          <form onSubmit={handleSubmit(onSalvarPerfil)} className={styles.formPerfil}>
            
            {/* Bloco de Avatar Ilustrativo de Usuário */}
            <div className={styles.avatarSection}>
              <div className={styles.avatarCircle}>
                <User size={50} color="#314d41" />
              </div>
              <p>Gerencie suas informações de acesso do sistema</p>
            </div>

            <div className={styles.gridCampos}>
              <div className={styles.fieldGroup}>
                <label>Nome Completo</label>
                <input type="text" {...register("nome", { required: true })} />
              </div>

              <div className={styles.fieldGroup}>
                <label>Nome de Acesso (Login)</label>
                <input 
                  type="text" 
                  {...register("login")} 
                  disabled 
                  style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }} 
                  title="O login não pode ser alterado por aqui"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label>E-mail</label>
                <input type="email" {...register("email", { required: true })} />
              </div>

              <div className={styles.fieldGroup}>
                <label>Telefone / WhatsApp</label>
                <input type="text" placeholder="(00) 00000-0000" {...register("telefone")} />
              </div>
            </div>

            <div className={styles.actionSection}>
              <button type="submit" className={styles.saveButton}>
                Salvar Alterações <Save size={18} />
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default PerfilPage;