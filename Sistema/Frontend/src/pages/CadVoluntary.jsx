import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, X } from 'lucide-react';
import styles from './CadVoluntary.module.css';

const CadVoluntary = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [deficiencias, setDeficiencias] = useState([]);
  const [defInput, setDefInput] = useState('');
  const defInputRef = useRef(null);

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      nome: '',
      cpf: '',
      nascimento: '',
      email: '',
      funcao: '',
      acesso: 'Voluntário',
      telefone: '',
      pcd: false,
      cep: '',
      endereco: '',
      bairro: '',
      uf: '',
      numero: '',
      dataEntrada: '',
      login: '',
      disponibilidade: 'Manhã',
      senha: '',
      observacoes: '',
    },
  });

  const isPcd = watch('pcd');
  const fotoRegister = register('foto');

  const addDeficiencia = (value) => {
    const trimmed = value.trim();
    if (trimmed && !deficiencias.includes(trimmed)) {
      setDeficiencias((prev) => [...prev, trimmed]);
    }
    setDefInput('');
  };

  const removeDeficiencia = (tag) => {
    setDeficiencias((prev) => prev.filter((d) => d !== tag));
  };

  const handleDefKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addDeficiencia(defInput);
    } else if (e.key === 'Backspace' && defInput === '' && deficiencias.length > 0) {
      setDeficiencias((prev) => prev.slice(0, -1));
    }
  };

  const onSubmit = (data) => {
    console.log({ ...data, deficiencias });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cadastro de Voluntários</h1>

      <form className={styles.card} onSubmit={handleSubmit(onSubmit)}>
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
                <input type="text" placeholder="Digite o nome completo" {...register('nome')} />
              </div>
              <div className={`${styles.fieldGroup} ${styles.fieldCpf}`}>
                <label>CPF <span className={styles.required}>*</span></label>
                <input type="text" placeholder="___.___.___-__" {...register('cpf')} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={`${styles.fieldGroup} ${styles.fieldNasc}`}>
                <label>Nascimento <span className={styles.required}>*</span></label>
                <input type="text" placeholder="00/00/0000" {...register('nascimento')} />
              </div>
              <div className={styles.fieldGroup}>
                <label>Email <span className={styles.required}>*</span></label>
                <input type="email" placeholder="exemplo@gmail.com" {...register('email')} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={`${styles.fieldGroup} ${styles.fieldFunc}`}>
                <label>Função <span className={styles.required}>*</span></label>
                <input type="text" placeholder="Ex: Cuidador" {...register('funcao')} />
              </div>
              <div className={`${styles.fieldGroup} ${styles.fieldAcesso}`}>
                <label>Acesso <span className={styles.required}>*</span></label>
                <select {...register('acesso')}>
                  <option value="Voluntário">Voluntário</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className={`${styles.fieldGroup} ${styles.fieldTel}`}>
                <label>Telefone <span className={styles.required}>*</span></label>
                <input type="text" placeholder="(__)_____-____" {...register('telefone')} />
              </div>
            </div>

            {/* Seção 2 - Endereço */}
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>2</span>
              <span className={styles.sectionTitle}>Endereço</span>
            </div>

            <div className={styles.row}>
              <div className={`${styles.fieldGroup} ${styles.fieldCep}`}>
                <label>CEP <span className={styles.required}>*</span></label>
                <input type="text" placeholder="00000-000" {...register('cep')} />
              </div>
              <div className={styles.fieldGroup}>
                <label>Endereço <span className={styles.required}>*</span></label>
                <input type="text" placeholder="Rua, Avenida, etc." {...register('endereco')} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Bairro <span className={styles.required}>*</span></label>
                <input type="text" placeholder="Digite o bairro" {...register('bairro')} />
              </div>
              <div className={`${styles.fieldGroup} ${styles.fieldNum}`}>
                <label>Número <span className={styles.required}>*</span></label>
                <input type="text" placeholder="123" {...register('numero')} />
              </div>
              <div className={styles.fieldGroup}>
                <label>Complemento</label>
                <input type="text" placeholder="Apto, Bloco, casa, etc." {...register('complemento')} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={`${styles.fieldGroup} ${styles.fieldUf}`}>
                <label>UF <span className={styles.required}>*</span></label>
                <select {...register('uf')}>
                  <option value="">Selecione</option>
                  <option>AC</option><option>AL</option><option>AP</option><option>AM</option>
                  <option>BA</option><option>CE</option><option>DF</option><option>ES</option>
                  <option>GO</option><option>MA</option><option>MT</option><option>MS</option>
                  <option>MG</option><option>PA</option><option>PB</option><option>PR</option>
                  <option>PE</option><option>PI</option><option>RJ</option><option>RN</option>
                  <option>RS</option><option>RO</option><option>RR</option><option>SC</option>
                  <option>SP</option><option>SE</option><option>TO</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
               <label>Cidade <span className={styles.required}>*</span></label>
                <input type="text" placeholder="Digite a cidade" {...register('cidade')} />
              </div>
            </div>

            {/* Seção 3 - PCD */}
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>3</span>
              <span className={styles.sectionTitle}>Condições especiais</span>
            </div>

            <div className={styles.pcdCheck}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" {...register('pcd')} />
                O voluntário possui alguma condição especial?
              </label>
              {isPcd && <p className={styles.pcdHint}>Selecionar condições (pode ser mais de uma)</p>}
            </div>

            {isPcd && (
              <div className={styles.deficienciaWrapper}>
                <input
                  ref={defInputRef}
                  type="text"
                  className={styles.deficienciaSearchInput}
                  value={defInput}
                  placeholder="Informe a condição..."
                  onChange={(e) => setDefInput(e.target.value)}
                  onKeyDown={handleDefKeyDown}
                  onBlur={() => defInput && addDeficiencia(defInput)}
                />
              </div>
            )}
            {isPcd && deficiencias.length > 0 && (
              <div className={styles.tagsContainer}>
                {deficiencias.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                    <button
                      type="button"
                      className={styles.tagRemove}
                      onClick={() => removeDeficiencia(tag)}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Seção 4 - Acesso */}
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>4</span>
              <span className={styles.sectionTitle}>Acesso ao sistema</span>
            </div>

            <div className={styles.row}>
              <div className={`${styles.fieldGroup} ${styles.fieldNasc}`}>
                <label>Data Entrada</label>
                <input type="text" placeholder="00/00/0000" {...register('dataEntrada')} />
              </div>
              <div className={styles.fieldGroup}>
                <label>Login</label>
                <input type="text" {...register('login')} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={`${styles.fieldGroup} ${styles.fieldDisp}`}>
                <label>Disponibilidade</label>
                <select {...register('disponibilidade')}>
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                  <option value="Integral">Integral</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label>Senha</label>
                <input type="password" {...register('senha')} />
              </div>
            </div>

          </section>

          {/* MEDIA SECTION */}
          <aside className={styles.mediaSection}>
            <p className={styles.fotoLabel}>Foto do Voluntário</p>
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
                style={{ display: 'none' }}
                {...fotoRegister}
                onChange={(e) => {
                  fotoRegister.onChange(e);
                  const file = e.target.files[0];
                  if (file) setPreviewImage(URL.createObjectURL(file));
                }}
              />
            </div>

            <div className={styles.textareaGroup}>
              <label>Observações</label>
              <textarea {...register('observacoes')} rows="22" />
            </div>
          </aside>
        </div>

        <div className={styles.formActions}>
          <button type="button" className={styles.backButton}>Voltar para a Lista</button>
          <button type="submit" className={styles.saveButton}>Finalizar cadastro</button>
        </div>
      </form>
    </div>
  );
};

export default CadVoluntary;
