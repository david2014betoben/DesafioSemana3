export type TipoAlerta = "info" | "exito" | "advertencia" | "error";

interface Props {
  tipo: TipoAlerta;
  titulo: string;
  mensaje: string;
  onCerrar?: () => void;
  onReintentar?: () => void;
}

// TODO [D]: alerta reutilizable
// - un color distinto por tipo (info, exito, advertencia, error)
// - role="alert"
// - boton cerrar si llega onCerrar, boton reintentar si llega onReintentar
const estilos: Record<TipoAlerta, string> = {
  info: "border-sky-200 bg-sky-50 text-sky-900",
  exito: "border-emerald-200 bg-emerald-50 text-emerald-900",
  advertencia: "border-amber-200 bg-amber-50 text-amber-900",
  error: "border-rose-200 bg-rose-50 text-rose-900",
};

const iconos: Record<TipoAlerta, string> = {
  info: "ℹ️",
  exito: "✅",
  advertencia: "⚠️",
  error: "❌",
};

export function AlertaBanner({
  tipo,
  titulo,
  mensaje,
  onCerrar,
  onReintentar,
}: Props) {
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-2xl border p-4 shadow-sm ${estilos[tipo]}`}
    >
      <span aria-hidden="true" className="text-lg">
        {iconos[tipo]}
      </span>

      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="font-bold">{titulo}</h3>

        <p className="text-sm leading-6">{mensaje}</p>

        {onReintentar && (
          <button
            type="button"
            onClick={onReintentar}
            className="mt-3 rounded-lg border border-current px-4 py-2 text-sm font-semibold transition hover:bg-white/60"
          >
            Intentar de nuevo
          </button>
        )}
      </div>

      {onCerrar && (
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar alerta"
          className="rounded-lg px-2 py-1 font-bold transition hover:bg-white/60"
        >
          ✕
        </button>
      )}
    </div>
  );
}
