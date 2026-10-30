import { api } from "../lib/axios";

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar_url: string | null;
}

export const perfilService = {
  obtener: () => api.get<UserProfile>("/auth/me").then((r) => r.data),

  // TODO [B]: PUT /auth/perfil con FormData
  // - campos: "name" (texto) y "foto" (archivo, solo si hay)
  // - no poner el Content-Type a mano, axios lo arma solo con FormData
  // - en services/upload.ts hay un ejemplo con un solo campo
  actualizar: async (nombre: string, foto?: File): Promise<UserProfile> => {
    const formData = new FormData();
    formData.append("name", nombre);
    if (foto) {
      formData.append("foto", foto);
    }

    const response = await api.put<UserProfile>("/auth/perfil", formData);
    return response.data;
  },
};
