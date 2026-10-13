import axios from "axios";
import { AUTH_EXPIRED_EVENT } from "./authEvents";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3333/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const tokenAtual = localStorage.getItem("token");
    const tokenDaRequisicao = error.config?.headers?.Authorization;
    if (
      error.response?.status === 401 &&
      tokenAtual &&
      tokenDaRequisicao === `Bearer ${tokenAtual}`
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  }
);

export function mensagemErro(error: unknown) {
  if (axios.isAxiosError(error)) {
    const mensagem = error.response?.data?.message;
    if (typeof mensagem === "string" && mensagem.trim()) return mensagem;
    if (!error.response) {
      return "Não foi possível conectar à API. Verifique se o backend está em execução.";
    }
    return "O servidor retornou uma resposta inesperada. Tente novamente.";
  }
  return "Ocorreu um erro inesperado.";
}
