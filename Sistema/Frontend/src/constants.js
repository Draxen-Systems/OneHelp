// Mapeamento centralizado de Tipo de Residência
// Usado tanto no CadAdopter (formulário) quanto no ListAdopter (filtros e tabela)

export const TIPO_RESIDENCIA_LABEL_TO_CODE = {
  Casa: "C",
  Apartamento: "A",
  "Chácara": "CH",
  Outro: "O",
};

export const TIPO_RESIDENCIA_CODE_TO_LABEL = {
  C: "Casa",
  A: "Apartamento",
  CH: "Chácara",
  O: "Outro",
};

export const API_BASE_URL = "http://127.0.0.1:8000";

// Mapeamento centralizado de campos de Animal
// Usado tanto no Cadanimals (formulário) quanto no ListAnimals (filtros e tabela)

export const SEXO_CODE_TO_LABEL = {
  M: "Macho",
  F: "Fêmea",
};

export const PORTE_CODE_TO_LABEL = {
  P: "Pequeno",
  M: "Médio",
  G: "Grande",
};

export const STATUS_ANIMAL_CODE_TO_LABEL = {
  Disponivel: "Disponível",
  Tratamento: "Em Tratamento",
  Adotado: "Adotado",
  Obito: "Óbito",
};

// Mapeamento centralizado de campos de Voluntário
// Usado tanto no CadVoluntary (formulário) quanto no ListVoluntary (filtros e tabela)

export const NIVEL_ACESSO_CODE_TO_LABEL = {
  ADMINISTRADOR: "Administrador",
  VOLUNTARIO: "Voluntário",
  VETERINARIO: "Veterinário",
};

export const STATUS_VOLUNTARIO_CODE_TO_LABEL = {
  ATIVO: "Ativo",
  INATIVO: "Inativo",
  AFASTADO: "Afastado",
};
