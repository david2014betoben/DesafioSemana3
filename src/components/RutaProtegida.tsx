import { Navigate, Outlet } from "react-router-dom";
import { useAuthHidratado } from "../hooks/useAuthHidratado";
import { useAuthStore } from "../store/useAuthStore";

export function RutaProtegida() {
  const hidratado = useAuthHidratado();
  const autenticado = useAuthStore((s) => s.autenticado);
  const token = useAuthStore((s) => s.token);

  if (!hidratado) {
    return <p role="status" className="p-6 text-center">Restaurando sesión...</p>;
  }

  if (!autenticado || !token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
