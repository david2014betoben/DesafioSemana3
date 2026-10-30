import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { tema } from "../tema";
import { ErrorBoundary } from "./ErrorBoundary";

const enlaces = [
  { to: "/dashboard", label: "Inicio" },
  { to: "/productos", label: "Productos" },
  { to: "/perfil", label: "Mi perfil" },
  { to: "/laboratorio", label: "Laboratorio UI" },
];

export function Layout() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const usuarioNombre = useAuthStore((s) => s.usuarioNombre);
  const usuarioAvatar = useAuthStore((s) => s.usuarioAvatar);
  const esAdmin = useAuthStore((s) => s.usuarioRol?.toLowerCase() === "admin");

  const enlacesVisibles = esAdmin
    ? [...enlaces, { to: "/admin/productos", label: "Cargar productos" }]
    : enlaces;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-marca-600 font-bold text-white">
              {tema.inicial}
            </span>
            <span className="text-lg font-bold tracking-tight">
              {tema.nombre}
            </span>
          </div>

          <nav className="flex flex-wrap gap-1 text-sm font-semibold">
            {enlacesVisibles.map((enlace) => (
              <NavLink
                key={enlace.to}
                to={enlace.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 transition ${
                    isActive
                      ? "bg-marca-50 text-marca-700"
                      : "text-slate-600 hover:bg-stone-100"
                  }`
                }
              >
                {enlace.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 text-sm font-semibold ">
            {usuarioAvatar ? (
              <img
                src={usuarioAvatar}
                alt="Foto de perfil"
                className="size-9 rounded-full object-cover"
              />
            ) : (
              <span className="grid size-9 place-items-center rounded-full bg-marca-100 text-xs text-marca-800">
                {(usuarioNombre ?? "NN").substring(0, 2).toUpperCase()}
              </span>
            )}
            <span className="hidden sm:block">{usuarioNombre}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-slate-500 hover:text-marca-700"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}
