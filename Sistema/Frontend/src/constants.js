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
