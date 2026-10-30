// datos de la tienda: nombre, textos y categorias
// los colores y la fuente estan en index.css

export interface Categoria {
  valor: string; // como se guarda en la API
  etiqueta: string; // como se muestra
}

export const tema = {
  nombre: "Panaderia",
  inicial: "P",
  emoji: "🥐",
  login: {
    kicker: "Del horno a tu mesa",
    titulo: "El sabor de lo recien hecho",
    texto: "Panes, masas y delicias artesanales para compartir cada día.",
  },
  // categorias de su tienda, con el prefijo del grupo. ejemplo:
  // { valor: "Ropa-Polos", etiqueta: "Polos" },
  categorias: [
    { valor: "Pan-Artesanal", etiqueta: "Pan artesanal" },
    { valor: "Pan-Integral", etiqueta: "Pan integral" },
    { valor: "Pan-Dulce", etiqueta: "Pan dulce" },
    { valor: "Pan-Salado", etiqueta: "Pan salado" },
  ] as Categoria[],
};

export function etiquetaCategoria(valor: string) {
  return tema.categorias.find((c) => c.valor === valor)?.etiqueta ?? valor;
}
