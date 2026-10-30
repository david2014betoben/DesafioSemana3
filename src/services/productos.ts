import { api } from "../lib/axios";
import { tema } from "../tema";
import type {
  CrearProductoDTO,
  PaginaProductos,
  Producto,
} from "../types/producto";

interface ProductoApi {
  id: number;
  name: string;
  category: string | null;
  price: string | number;
  stock: number;
  description: string | null;
  image_url: string | null;
}

const convertirProducto = (producto: ProductoApi): Producto => ({
  id: producto.id,
  nombre: producto.name,
  categoria: producto.category ?? "Sin categoría",
  precio: Number(producto.price),
  stock: producto.stock,
  descripcion: producto.description ?? "",
  imagenUrl: producto.image_url,
});

async function consultarCategoria(
  categoria: string,
  skip: number,
  limit: number,
): Promise<Producto[]> {
  const respuesta = await api.get<ProductoApi[]>("/products/", {
    params: {
      skip,
      limit,
      category: categoria,
    },
  });

  return respuesta.data.map(convertirProducto);
}
export const productosService = {
  getTodos: async (): Promise<Producto[]> => {
    const respuesta = await api.get<ProductoApi[]>("/products/", {
      params: { limit: 500 },
    });
    return respuesta.data.map(convertirProducto);
  },

  // TODO [C]: pedir una sola pagina
  // - GET /products/?skip=...&limit=...&category=...
  // - pagina 1 -> skip 0, pagina 2 -> skip porPagina, ...
  // - la API no devuelve el total: pedir porPagina + 1 y si llegan
  //   mas de porPagina es que hay pagina siguiente
  getPagina: async (
    pagina: number,
    porPagina: number,
    categoria: string,
  ): Promise<PaginaProductos> => {
    if (!Number.isSafeInteger(pagina) || pagina < 1) {
      throw new Error("Número de página inválido");
    }

    if (!Number.isSafeInteger(porPagina) || porPagina < 1) {
      throw new Error("Cantidad de productos inválida");
    }

    const categoriasPermitidas = tema.categorias.map((cat) => cat.valor);

    const skip = (pagina - 1) * porPagina;
    const limit = porPagina + 1;

    // CASO 1: el usuario seleccionó una categoría.
    if (categoria !== "Todas") {
      if (!categoriasPermitidas.includes(categoria)) {
        return {
          productos: [],
          hayMas: false,
        };
      }

      const productos = await consultarCategoria(categoria, skip, limit);

      return {
        productos: productos.slice(0, porPagina),
        hayMas: productos.length > porPagina,
      };
    }

    // CASO 2: el usuario seleccionó "Todas".
    // Solo debemos consultar categorías de panadería.
    if (categoriasPermitidas.length === 0) {
      return {
        productos: [],
        hayMas: false,
      };
    }

    // La API solo permite filtrar una categoría
    // exacta por petición. Consultamos las nuestras.
    const hasta = pagina * porPagina + 1;

    const lotes = await Promise.all(
      categoriasPermitidas.map((valor) => consultarCategoria(valor, 0, hasta)),
    );

    const productosTienda: Producto[] = [];

    // Intercalamos los productos de cada categoría.
    // Así mantenemos un orden estable entre páginas.
    const maxLongitud = Math.max(...lotes.map((lote) => lote.length));

    for (let indice = 0; indice < maxLongitud; indice++) {
      for (const lote of lotes) {
        if (indice < lote.length) {
          productosTienda.push(lote[indice]);
        }
      }
    }

    // Extraemos únicamente la página solicitada.
    const ventana = productosTienda.slice(skip, skip + limit);

    return {
      productos: ventana.slice(0, porPagina),
      hayMas: ventana.length > porPagina,
    };
  },

  // Mantenemos la funcionalidad para crear productos.
  crear: async (datos: CrearProductoDTO): Promise<Producto> => {
    const respuesta = await api.post<ProductoApi>("/products/", {
      name: datos.nombre,
      category: datos.categoria,
      price: datos.precio,
      stock: datos.stock,
      description: datos.descripcion || null,
      image_url: datos.imagenUrl || null,
    });

    return convertirProducto(respuesta.data);
  },
};
