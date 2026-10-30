import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { ListaProductos } from "../components/ListaProductos";
import { Paginacion } from "../components/Paginacion";
import { useApi } from "../hooks/useApi";
import { useDebounce } from "../hooks/useDebounce";
import { productosService } from "../services/productos";
import { tema } from "../tema";

const POR_PAGINA = 6;

// TODO [C]: catalogo de la tienda
// - ahora se ven los productos de TODOS los grupos. Mostrar solo los de
//   su tienda usando tema.categorias (el select tambien)
// - guardar pagina y categoria en la URL con useSearchParams
//   ej: /productos?categoria=Ropa-Polos&pagina=2
// - si la URL trae algo raro (?pagina=abc, una categoria que no es suya)
//   usar los valores por defecto
// - al cambiar de categoria volver a la pagina 1
// - implementar getPagina y <Paginacion />

export function ProductosPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [busqueda, setBusqueda] = useState("");

  const busquedaEstable = useDebounce(busqueda, 350);

  // 1. Leer y validar la categoría desde la URL.
  const categoriaURL = searchParams.get("categoria");

  const categoria =
    categoriaURL && tema.categorias.some((cat) => cat.valor === categoriaURL)
      ? categoriaURL
      : "Todas";

  // 2. Leer y validar el número de página.
  const paginaTexto = searchParams.get("pagina") ?? "1";
  const paginaNumero = Number(paginaTexto);

  const pagina =
    /^[1-9]\d*$/.test(paginaTexto) &&
    Number.isSafeInteger(paginaNumero) &&
    paginaNumero <= 1000
      ? paginaNumero
      : 1;

  // 3. Consultar la API según página y categoría.
  const { data, cargando, error, recargar } = useApi(
    () => productosService.getPagina(pagina, POR_PAGINA, categoria),
    [pagina, categoria],
  );

  // 4. Filtrar por texto SOLO los productos
  // de la página actual, sin otra petición HTTP.
  const productosFiltrados = useMemo(() => {
    const productos = data?.productos ?? [];
    const texto = busquedaEstable.trim().toLowerCase();

    if (!texto) return productos;

    return productos.filter((producto) => {
      const contenido =
        `${producto.nombre} ${producto.descripcion}`.toLowerCase();

      return contenido.includes(texto);
    });
  }, [data, busquedaEstable]);

  // 5. Cambiar categoría y regresar a página 1.
  const cambiarCategoria = (nueva: string) => {
    setBusqueda("");

    if (nueva === "Todas") {
      setSearchParams({ pagina: "1" });
      return;
    }

    setSearchParams({
      categoria: nueva,
      pagina: "1",
    });
  };

  // 6. Cambiar página conservando la categoría.
  const irAPagina = (nueva: number) => {
    if (!Number.isSafeInteger(nueva) || nueva < 1) return;

    setSearchParams((actuales) => {
      const siguientes = new URLSearchParams(actuales);
      siguientes.set("pagina", String(nueva));
      return siguientes;
    });
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    cambiarCategoria("Todas");
  };

  return (
    <section className="space-y-6">
      {/* Encabezado */}
      <header className="rounded-3xl bg-marca-50 px-6 py-8 sm:px-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-marca-700">
          Horno & Miga · Panadería artesanal
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight text-marca-900 sm:text-4xl">
          Delicias recién horneadas
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">
          Explora nuestros panes y especialidades. Encuentra tu favorito y
          descubre el sabor de lo hecho con cariño.
        </p>
      </header>

      {/* Controles del catálogo */}
      <div className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-5 md:grid-cols-[1fr_240px]">
        <label className="block text-sm font-semibold text-slate-700">
          Buscar productos
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Ej. pan dulce, integral..."
            className="mt-2 block w-full rounded-xl border border-stone-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-marca-500 focus:ring-2 focus:ring-marca-100"
          />
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Categoría
          <select
            value={categoria}
            onChange={(e) => cambiarCategoria(e.target.value)}
            className="mt-2 block w-full rounded-xl border border-stone-300 bg-white px-4 py-3 font-normal outline-none transition focus:border-marca-500 focus:ring-2 focus:ring-marca-100"
          >
            <option value="Todas">Todas las categorías</option>

            {tema.categorias.map((cat) => (
              <option key={cat.valor} value={cat.valor}>
                {cat.etiqueta}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Indicadores */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-stone-600">
          {cargando
            ? "Consultando productos..."
            : `Mostrando ${productosFiltrados.length} productos en la página ${pagina}`}
        </p>

        {busqueda && (
          <p className="text-xs text-stone-500">
            La búsqueda filtra solamente esta página.
          </p>
        )}
      </div>

      {/* La lista será completada en el inciso D */}
      <ListaProductos
        productos={productosFiltrados}
        cargando={cargando}
        error={error}
        porPagina={POR_PAGINA}
        onReintentar={recargar}
        onLimpiarFiltros={limpiarFiltros}
      />

      {/* Navegación entre páginas */}
      <Paginacion
        pagina={pagina}
        hayMas={data?.hayMas ?? false}
        deshabilitado={cargando || Boolean(error)}
        onCambiarPagina={irAPagina}
      />
    </section>
  );
}
