// Funcoes utilitarias compartilhadas entre as listagens (Adotantes, Animais, Voluntarios)
import { API_BASE_URL } from "../constants";

export const removerAcentos = (str) =>
  str
    ? str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()
    : "";

export const apenasNumeros = (str) => (str ? str.replace(/\D/g, "") : "");

// Converte YYYY-MM-DD (formato da API) -> DD/MM/AAAA (formato de exibicao)
export const formatarData = (dataStr) => {
  if (!dataStr) return "";
  const partes = dataStr.split("-");
  if (partes.length === 3) {
    const [ano, mes, dia] = partes;
    return `${dia}/${mes}/${ano}`;
  }
  return dataStr;
};

// Resolve a URL completa de uma foto retornada pela API (caminho relativo ou absoluto)
export const montarUrlFoto = (foto) => {
  if (!foto) return null;
  if (foto.startsWith("http")) return foto;
  return `${API_BASE_URL}${foto}`;
};
