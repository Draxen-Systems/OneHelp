import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Upload } from 'lucide-react';
import styles from './CadAdopter.module.css';

const CadAdopter = () => {
  const [previewImage, setPreviewImage] = useState(null);

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      nome: '',
      cpf: '',
      nascimento: '',
      email: '',
      pessoasFamilia: 0,
      tipoResidencia: 'Casa',
      telefone: '',
      pcd: false,
      deficiencia: '',
      cep: '',
      endereco: '',
      bairro: '',
      uf: '',
      numero: '',
      observacoes: ''
    }
  });

  const isPcd = watch('pcd');
  const fotoRegister = register('foto');

  const onSubmit = (data) => {
    console.log(data);
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
                <input type="text" {...register('nome')} />
              </div>
              <div className={styles.fieldGroup}>
                <label>CPF</label>
                <input type="text" placeholder="___.___.___-__" {...register('cpf')} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Nascimento</label>
                <input type="text" placeholder="00/00/0000" {...register('nascimento')} />
              </div>
              <div className={styles.fieldGroup}>
                <label>Email</label>
                <input type="email" {...register('email')} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Pessoas na Família</label>
                <input type="number" min="0" {...register('pessoasFamilia')} />
              </div>
              <div className={styles.fieldGroup}>
                <label>Tipo de Residência</label>
                <select {...register('tipoResidencia')}>
                  <option value="Casa">Casa</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div className={styles.fieldGroup}>
                <label>Telefone</label>
                <input type="text" placeholder="(__)_____-____" {...register('telefone')} />
              </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.row}>
              <div className={styles.pcdSection}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" {...register('pcd')} /> PCD
                </label>
                <div className={styles.inlineField}>
                  <label>Deficiência</label>
                  <input 
                    type="text" 
                    {...register('deficiencia')} 
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
                <input type="text" placeholder="00000-000" {...register('cep')} />
              </div>
              <div className={styles.fieldGroup}>
                <label>Endereço</label>
                <input type="text" {...register('endereco')} />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label>Bairro</label>
                <input type="text" {...register('bairro')} />
              </div>
              <div className={styles.fieldGroup}>
                <label>UF</label>
                <input type="text" maxLength="2" {...register('uf')} />
              </div>
              <div className={styles.fieldGroup}>
                <label>Número</label>
                <input type="text" {...register('numero')} />
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
                style={{ display: 'none' }}
                {...fotoRegister}
                onChange={(e) => {
                  fotoRegister.onChange(e);
                  const file = e.target.files[0];
                  if (file) {
                    setPreviewImage(URL.createObjectURL(file)); 
                  }
                }}
              />
            </div>
            
            <div className={styles.textareaGroup}>
              <label>Observações</label>
              <textarea {...register('observacoes')} rows="6" />
            </div>
          </aside>
        </div>

        <div className={styles.formActions}>
          <button type="button" className={styles.backButton}>Voltar para a Lista</button>
          <button type="submit" className={styles.saveButton}>Salvar</button>
        </div>
      </form>
    </div>
  );
};

export default CadAdopter;