import { useEffect, useState } from "react";
interface Props {
  fotoActual: string | null;
  iniciales: string;
  onChange: (file: File | undefined) => void;
}

// TODO [B]: input de foto con preview local
// - validar que sea imagen (file.type) y que pese menos de 2MB (file.size)
// - si no pasa, mostrar un mensaje de error
// - preview con URL.createObjectURL(file) y avisar al padre con onChange(file)
// - mostrar preview ?? fotoActual ?? iniciales
// - boton "Quitar foto" cuando hay preview
// - liberar la url con URL.revokeObjectURL en el cleanup de un useEffect
export function InputFotoPerfil({ fotoActual, iniciales, onChange }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Limpiar la URL creada con createObjectURL al desmontar o cambiar preview
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) return;

    // Validar que sea imagen
    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecciona un archivo de imagen válido.");
      return;
    }

    // Validar tamaño menor a 2MB (2 * 1024 * 1024 bytes)
    if (file.size > 2 * 1024 * 1024) {
      setError("La imagen debe pesar menos de 2 MB.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onChange(file);
  };

  const quitarFoto = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onChange(undefined);
  };

  const imagenMostrada = preview ?? fotoActual;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="grid size-28 place-items-center overflow-hidden rounded-full border-4 border-marca-600 bg-marca-100 text-2xl font-bold text-marca-800 shadow-sm">
        {imagenMostrada ? (
          <img
            src={imagenMostrada}
            alt="Foto de perfil"
            className="size-full object-cover"
          />
        ) : (
          iniciales
        )}
      </div>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

      <div className="flex items-center gap-2">
        <label className="cursor-pointer rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-200 transition">
          Seleccionar foto
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {preview && (
          <button
            type="button"
            onClick={quitarFoto}
            className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
          >
            Quitar foto
          </button>
        )}
      </div>
    </div>
  );
}
