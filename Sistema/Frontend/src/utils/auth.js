import { API_BASE_URL } from "../constants";

const ACCESS_KEY = "onehelp_access_token";
const REFRESH_KEY = "onehelp_refresh_token";
const USUARIO_KEY = "onehelp_usuario";

export const login = async (loginValue, senha) => {
  const response = await fetch(`${API_BASE_URL}/api/login/teste/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login: loginValue, senha }),
  });

  const dados = await response.json();

  if (!response.ok) {
    throw new Error(dados.erro || "Não foi possível efetuar o login.");
  }

  localStorage.setItem(ACCESS_KEY, dados.access);
  localStorage.setItem(REFRESH_KEY, dados.refresh);
  localStorage.setItem(USUARIO_KEY, JSON.stringify(dados.usuario));

  return dados.usuario;
};

export const logout = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USUARIO_KEY);
};

export const getAccessToken = () => localStorage.getItem(ACCESS_KEY);

export const getUsuario = () => {
  const dados = localStorage.getItem(USUARIO_KEY);
  return dados ? JSON.parse(dados) : null;
};

export const isAuthenticated = () => Boolean(getAccessToken());

const refreshAccessToken = async () => {
  const refresh = localStorage.getItem(REFRESH_KEY);
  if (!refresh) return null;

  const response = await fetch(`${API_BASE_URL}/api/login/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    logout();
    return null;
  }

  const dados = await response.json();
  localStorage.setItem(ACCESS_KEY, dados.access);
  return dados.access;
};

// fetch autenticado: anexa o Bearer token e tenta renovar uma vez em caso de token ausente/expirado/inválido.
// IsVoluntarioLogado (backend) sempre responde 403 nesses casos, nunca 401, então ambos disparam o refresh.
export const authFetch = async (url, options = {}) => {
  const fazerRequisicao = (token) =>
    fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

  let response = await fazerRequisicao(getAccessToken());

  if (response.status === 401 || response.status === 403) {
    const novoToken = await refreshAccessToken();
    if (!novoToken) return response;
    response = await fazerRequisicao(novoToken);
  }

  return response;
};
