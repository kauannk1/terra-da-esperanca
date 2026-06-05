import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: ""
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || "Ocorreu um erro inesperado."
    };
  }

  componentDidCatch(error) {
    // Preserve the stack in dev tools while showing a readable fallback in the UI.
    // eslint-disable-next-line no-console
    console.error("Terra da Esperanca UI error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="error-fallback">
          <div className="error-fallback-card">
            <h2>Encontramos um problema ao carregar esta tela.</h2>
            <p>{this.state.errorMessage}</p>
            <button type="button" className="primary-small-button" onClick={() => window.location.reload()}>
              Recarregar sistema
            </button>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
