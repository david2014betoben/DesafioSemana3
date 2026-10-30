const API = "https://api-funval-g6.onrender.com";
const token = (process.env.ADMIN_TOKEN ?? "").replace(/^Bearer\s+/i, "").trim();

if (!token) {
  console.error("Falta ADMIN_TOKEN.");
  process.exit(1);
}

const productos = [
  {
    name: "Marraqueta paceña",
    description:
      "Pan tradicional de La Paz, de corteza crujiente y miga suave.",
    price: 1.5,
    stock: 80,
    category: "Pan-Artesanal",
  },
  {
    name: "Pan de batalla",
    description: "Pan boliviano clásico, ideal para desayunos y meriendas.",
    price: 2,
    stock: 60,
    category: "Pan-Artesanal",
  },
  {
    name: "Cuñapé cruceño",
    description:
      "Tradicional horneado del oriente boliviano con almidón de yuca y queso.",
    price: 5,
    stock: 35,
    category: "Pan-Salado",
  },
  {
    name: "Pan de arroz",
    description: "Especialidad oriental elaborada con arroz, yuca y queso.",
    price: 4,
    stock: 30,
    category: "Pan-Salado",
  },
  {
    name: "Pan casero chapaco",
    description:
      "Pan artesanal de inspiración tarijeña, de masa suave y horneado tradicional.",
    price: 3,
    stock: 45,
    category: "Pan-Artesanal",
  },
  {
    name: "Tawa tawa",
    description:
      "Masa frita tradicional boliviana, deliciosa con miel o azúcar.",
    price: 3,
    stock: 40,
    category: "Pan-Dulce",
  },
  {
    name: "Empanada de queso",
    description:
      "Empanada horneada con relleno de queso, ideal para acompañar el café.",
    price: 5,
    stock: 35,
    category: "Pan-Salado",
  },
  {
    name: "Pan de quinua",
    description:
      "Pan nutritivo elaborado con una mezcla de quinua y harina integral.",
    price: 6,
    stock: 25,
    category: "Pan-Integral",
  },
  {
    name: "Pan integral de avena",
    description: "Pan elaborado con harina integral y avena, rico en fibra.",
    price: 5,
    stock: 30,
    category: "Pan-Integral",
  },
  {
    name: "Rosca de anís",
    description: "Rosca dulce tradicional con un delicado aroma a anís.",
    price: 3.5,
    stock: 45,
    category: "Pan-Dulce",
  },
];

// Clave para identificar un producto existente.
function clave(producto) {
  return `${producto.category}::${producto.name.toLowerCase().trim()}`;
}

// Leer los productos existentes de una categoría.
// Esto permite evitar duplicaciones al ejecutar el script.
async function obtenerExistentes(categoria) {
  const encontrados = [];
  const limite = 50;

  for (let pagina = 0; pagina < 20; pagina++) {
    const url = new URL("/products/", API);

    url.searchParams.set("category", categoria);
    url.searchParams.set("skip", String(pagina * limite));
    url.searchParams.set("limit", String(limite));

    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error(
        `Error consultando ${categoria}: HTTP ${respuesta.status}`,
      );
    }

    const datos = await respuesta.json();

    if (!Array.isArray(datos)) {
      throw new Error("La API no devolvió una lista de productos.");
    }

    encontrados.push(...datos);

    if (datos.length < limite) return encontrados;
  }

  throw new Error(
    `Hay demasiados productos en ${categoria}; revisa antes de continuar.`,
  );
}

async function main() {
  const categorias = [...new Set(productos.map((p) => p.category))];
  const existentes = new Set();

  console.log("Consultando productos existentes...");

  for (const categoria of categorias) {
    const encontrados = await obtenerExistentes(categoria);

    for (const producto of encontrados) {
      existentes.add(clave(producto));
    }
  }

  let creados = 0;
  let omitidos = 0;
  let errores = 0;

  for (const producto of productos) {
    if (existentes.has(clave(producto))) {
      console.log(`OMITIDO: ${producto.name} ya existe`);
      omitidos++;
      continue;
    }

    const respuesta = await fetch(`${API}/products/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...producto,
        image_url: null,
      }),
    });

    if (!respuesta.ok) {
      const detalle = await respuesta.text();

      console.error(
        `ERROR: ${producto.name} (HTTP ${respuesta.status})`,
        detalle,
      );

      errores++;

      if (respuesta.status === 401 || respuesta.status === 403) {
        throw new Error(
          "Token inválido, vencido o sin permisos de administrador.",
        );
      }

      continue;
    }

    const creado = await respuesta.json();
    existentes.add(clave(producto));

    console.log(`CREADO: ${creado.name} (ID ${creado.id})`);
    creados++;
  }

  console.log("\n--- RESUMEN ---");
  console.log(`Creados: ${creados}`);
  console.log(`Ya existentes: ${omitidos}`);
  console.log(`Errores: ${errores}`);

  if (errores > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
