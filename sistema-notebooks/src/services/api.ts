import axios from "axios";

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
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
    }
    return Promise.reject(error);
  }
);

export function mensagemErro(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? "Não foi possível comunicar com o servidor.";
  }
  return "Ocorreu um erro inesperado.";
}
