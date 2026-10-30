import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

export const api = axios.create({
  baseURL: "https://api-funval-g6.onrender.com",
});

// antes de cada peticion le pegamos el token en el header
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Un 401 del login significa credenciales incorrectas, no sesión expirada.
let redirigiendo = false;

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const ruta = new URL(
        error.config?.url ?? "",
        api.defaults.baseURL,
      ).pathname.replace(/\/+$/, "");

      if (ruta !== "/auth/login" && !redirigiendo) {
        redirigiendo = true;
        useAuthStore.getState().logout();
        window.location.replace("/login?sesion=expirada");
      }
    }

    return Promise.reject(error);
  },
);
