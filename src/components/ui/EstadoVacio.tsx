interface Props {
  titulo: string;
  descripcion?: string;
  accion?: { label: string; onClick: () => void };
}

// TODO [D]: estado vacio con icono, titulo, descripcion y boton opcional
export function EstadoVacio({ titulo, descripcion, accion }: Props) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
      <div
        aria-hidden="true"
        className="mb-5 grid size-20 place-items-center rounded-full bg-marca-50 text-4xl"
      >
        🧺
      </div>

      <h3 className="text-xl font-bold text-stone-900">{titulo}</h3>

      {descripcion && (
        <p className="mt-2 max-w-md text-sm leading-6 text-stone-500">
          {descripcion}
        </p>
      )}

      {accion && (
        <button
          type="button"
          onClick={accion.onClick}
          className="mt-6 rounded-xl bg-marca-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-marca-700"
        >
          {accion.label}
        </button>
      )}
    </div>
  );
}
