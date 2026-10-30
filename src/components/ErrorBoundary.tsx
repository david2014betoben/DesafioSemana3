import { Component, type ErrorInfo, type ReactNode } from "react";

import { useLocation } from "react-router-dom";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  tieneError: boolean;
  error: Error | null;
}

// TODO [D]: error boundary (solo existe como componente de clase)
// - getDerivedStateFromError: guardar { tieneError: true, error }
// - componentDidCatch: console.error del error y de info.componentStack
// - si hay error: mostrar fallback o una tarjeta con el mensaje
//   y un boton "Intentar de nuevo" que limpie el state
// se puede probar en /laboratorio
class CapturadorErrores extends Component<Props, State> {
  state: State = {
    tieneError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      tieneError: true,
      error,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Error capturado por ErrorBoundary:", error);

    console.error("Pila de componentes:", info.componentStack);
  }

  reiniciar = () => {
    this.setState({
      tieneError: false,
      error: null,
    });
  };

  render() {
    if (this.state.tieneError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <section
          role="alert"
          className="mx-auto max-w-xl rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-sm"
        >
          <div
            aria-hidden="true"
            className="mx-auto mb-5 grid size-20 place-items-center rounded-full bg-rose-50 text-4xl"
          >
            ⚠️
          </div>

          <h2 className="text-2xl font-bold text-stone-900">Algo salió mal</h2>

          <p className="mt-3 text-sm leading-6 text-stone-600">
            Se produjo un error inesperado al mostrar esta pantalla. Puedes
            intentar nuevamente.
          </p>

          {import.meta.env.DEV && this.state.error && (
            <p className="mt-4 break-words rounded-xl bg-rose-50 p-3 text-xs text-rose-800">
              {this.state.error.message}
            </p>
          )}

          <button
            type="button"
            onClick={this.reiniciar}
            className="mt-6 rounded-xl bg-marca-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-marca-700"
          >
            Intentar de nuevo
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}

// EXTRA D:
// Cada ruta recibe una instancia independiente del boundary. Al cambiar de ruta, React crea una nueva instancia sin el error anterior.
export function ErrorBoundary(props: Props) {
  const location = useLocation();

  return <CapturadorErrores key={location.pathname} {...props} />;
}
