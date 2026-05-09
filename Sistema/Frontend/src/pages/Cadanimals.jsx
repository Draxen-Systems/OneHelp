import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Camera } from 'lucide-react';
import styles from './Cadanimals.module.css';

const Cadanimals = () => {
  const [previewImage, setPreviewImage] = useState(null);

  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      nome: '',
      especie: 'Cachorro',
      sexo: 'Macho',
      raca: 'Sem Raça Definida',
      ativo: true,
      dataResgate: '2025-01-10',
      porte: 'Pequeno',
      castrado: true,
      pcd: false,
      deficiencia: '',
      dono: '',
    }
  });

  const isPcd = watch('pcd');
  const isAtivo = watch('ativo'); 

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className={styles.container}>
      
      <h1 className={styles.title}>Cadastro de Animais</h1>

      <form className={styles.card} onSubmit={handleSubmit(onSubmit)}>
        
        <div className={styles.topContent}>
          <section className={styles.formSection}>
            
            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label><span className={styles.bullet}>•</span> Nome do Animal</label>
                <input type="text" {...register('nome')} />
              </div>
              <div className={styles.fieldGroup}>
                <label><span className={styles.bullet}>•</span> Espécie</label>
                <select {...register('especie')}>
                  <option value="Cachorro">Cachorro</option>
                  <option value="Gato">Gato</option>
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label><span className={styles.bullet}>•</span> Sexo</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input type="radio" value="Macho" {...register('sexo')} /> Macho
                  </label>
                  <label className={styles.radioLabel}>
                    <input type="radio" value="Fêmea" {...register('sexo')} /> Fêmea
                  </label>
                </div>
              </div>
              
              <div className={styles.fieldGroup}>
                <label><span className={styles.bullet}>•</span> Raça</label>
                <select {...register('raca')}>
                  <option value="Sem Raça Definida">Sem Raça Definida</option>
                </select>
              </div>

              <div className={styles.toggleGroup}>
                <label className={styles.ativoLabel}>{isAtivo ? 'Ativo' : 'Desativado'}</label>
                <label className={styles.switch}>
                  <input type="checkbox" {...register('ativo')} />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label><span className={styles.bullet}>•</span> Data do Resgate</label>
                <input type="date" {...register('dataResgate')} />
              </div>
              
              <div className={styles.fieldGroup}>
                <label><span className={styles.bullet}>•</span> Porte</label>
                <select {...register('porte')}>
                  <option value="Pequeno">Pequeno</option>
                  <option value="Médio">Médio</option>
                  <option value="Grande">Grande</option>
                </select>
              </div>

              <div className={styles.checkboxWrapper}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" {...register('castrado')} /> Castrado
                </label>
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
              <div className={styles.fieldGroupSingle}>
                <label>Dono</label>
                <input type="text" {...register('dono')} />
              </div>
            </div>

            <div className={styles.actionRow}>
              <label htmlFor="uploadContrato" className={styles.uploadButton}>
                Upload Contrato <Plus size={18} />
              </label>
              <input 
                type="file" 
                id="uploadContrato" 
                style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,image/*"
                {...register('contrato')}
              />
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
                style={{ display: 'none' }}
                {...register('foto', {
                  onChange: (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setPreviewImage(URL.createObjectURL(file)); 
                    }
                  }
                })}
              />
            </div>
            
            <div className={styles.textareaGroup}>
              <label>Observações</label>
              <textarea {...register('observacoes')} />
            </div>
          </aside>
        </div>

        <div className={styles.historySection}>
          <label><span className={styles.bullet}>•</span> História do Animal</label>
          <textarea {...register('historia')} className={styles.historyTextarea} />
        </div>

        <div className={styles.formActions}>
          <button type="button" className={styles.backButton}>Voltar para a Lista</button>
          <button type="submit" className={styles.saveButton}>Salvar</button>
        </div>

      </form>
    </div>
  );
};

export default Cadanimals;