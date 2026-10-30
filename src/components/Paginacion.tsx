interface Props {
  pagina: number;
  hayMas: boolean;
  deshabilitado: boolean;
  onCambiarPagina: (nueva: number) => void;
}

export function Paginacion({
  pagina,
  hayMas,
  deshabilitado,
  onCambiarPagina,
}: Props) {
  const puedeRetroceder = pagina > 1 && !deshabilitado;
  const puedeAvanzar = hayMas && !deshabilitado;

  return (
    <nav
      aria-label="Paginación del catálogo"
      className="mt-8 flex flex-wrap items-center justify-center gap-4"
    >
      <button
        type="button"
        disabled={!puedeRetroceder}
        onClick={() => onCambiarPagina(pagina - 1)}
        className="rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-marca-500 hover:text-marca-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← Anterior
      </button>

      <span
        aria-live="polite"
        className="rounded-xl bg-marca-50 px-4 py-2.5 text-sm font-bold text-marca-800"
      >
        Página {pagina}
      </span>

      <button
        type="button"
        disabled={!puedeAvanzar}
        onClick={() => onCambiarPagina(pagina + 1)}
        className="rounded-xl bg-marca-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-marca-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Siguiente →
      </button>
    </nav>
  );
}
