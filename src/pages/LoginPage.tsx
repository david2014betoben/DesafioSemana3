import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { authService } from "../services/auth";
import { useAuthStore } from "../store/useAuthStore";
import { tema } from "../tema";

const ANIO = new Date().getFullYear();

function StoreMark() {
  return (
    <span className="grid size-10 place-items-center rounded-xl bg-marca-600 text-lg font-bold text-white shadow-sm">
      {tema.inicial}
    </span>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sesionExpirada = searchParams.get("sesion") === "expirada";
  const loginStore = useAuthStore((s) => s.login);
  const [errorServidor, setErrorServidor] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorServidor("");
      const respuesta = await authService.login(data);

      loginStore(
        respuesta.access_token,
        respuesta.user_name,
        respuesta.user_role,
      );
      navigate("/dashboard", { replace: true });
    } catch {
      setErrorServidor(
        "Credenciales incorrectas o error al conectar con el servidor.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-stone-50 px-5 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl shadow-stone-200/50 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden flex-col justify-between bg-marca-700 p-10 text-white lg:flex xl:p-14">
            <div className="flex items-center gap-3">
              <StoreMark />
              <span className="text-xl font-bold tracking-tight">{tema.nombre}</span>
            </div>
            <div className="max-w-md">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-marca-200">
                {tema.login.kicker}
              </p>
              <h1 className="text-5xl font-bold leading-[1.05] tracking-tight xl:text-6xl">
                {tema.login.titulo}
              </h1>
              <p className="mt-6 max-w-sm text-base leading-7 text-marca-100">
                {tema.login.texto}
              </p>
            </div>
            <p className="text-sm text-marca-200">© {ANIO} {tema.nombre}</p>
          </div>

          <div className="flex items-center justify-center p-7 sm:p-12 lg:p-14">
            <div className="w-full max-w-sm">
              <div className="mb-10 flex items-center gap-3 lg:hidden">
                <StoreMark />
                <span className="text-xl font-bold tracking-tight">
                  {tema.nombre}
                </span>
              </div>
              <div className="mb-8">
                <p className="mb-3 text-sm font-semibold text-marca-700">
                  Bienvenido de vuelta
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-slate-950">
                  Inicia sesión
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Accede a tu cuenta para ver tus pedidos y favoritos.
                </p>
              </div>

              {sesionExpirada && (
                <div role="status" className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                  Tu sesión expiró. Inicia sesión nuevamente para continuar.
                </div>
              )}

              {errorServidor && (
                <div className="mb-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-600 border border-rose-200">
                  {errorServidor}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <label className="block text-sm font-semibold text-slate-700">
                  Correo electrónico
                  <input
                    {...register("email")}
                    className="mt-2 h-12 w-full rounded-xl border border-stone-300 bg-white px-4 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-marca-600 focus:ring-4 focus:ring-marca-600/10"
                    type="email"
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <span className="mt-1 block text-xs font-medium text-rose-500">
                      {errors.email.message}
                    </span>
                  )}
                </label>

                <label className="block text-sm font-semibold text-slate-700">
                  Contraseña
                  <input
                    {...register("password")}
                    className="mt-2 h-12 w-full rounded-xl border border-stone-300 bg-white px-4 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-marca-600 focus:ring-4 focus:ring-marca-600/10"
                    type="password"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <span className="mt-1 block text-xs font-medium text-rose-500">
                      {errors.password.message}
                    </span>
                  )}
                </label>

                <div className="flex justify-end">
                  <a
                    className="text-xs font-semibold text-marca-700 hover:text-marca-800"
                    href="#forgot-password"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <button
                  className="h-12 w-full rounded-xl bg-marca-600 text-sm font-bold text-white transition hover:bg-marca-700 focus:outline-none focus:ring-4 focus:ring-marca-600/20 disabled:opacity-50"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-500">
                ¿Todavía no tienes una cuenta?{" "}
                <a
                  className="font-bold text-marca-700 hover:text-marca-800"
                  href="#register"
                >
                  Regístrate
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
