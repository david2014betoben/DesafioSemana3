import { useEffect, useState } from "react";

export function useDebounce<T>(valor: T, demora = 350): T {
  const [valorEstable, setValorEstable] = useState(valor);

  useEffect(() => {
    const temporizador = window.setTimeout(() => {
      setValorEstable(valor);
    }, demora);

    return () => {
      window.clearTimeout(temporizador);
    };
  }, [valor, demora]);

  return valorEstable;
}
