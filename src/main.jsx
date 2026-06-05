import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/app.css";

const rootElement = document.getElementById("root");

function serializeError(error) {
  if (!error) return "Erro desconhecido.";
  if (typeof error === "string") return error;
  return error.message || JSON.stringify(error);
}

function showFatalError(error) {
  if (!rootElement) return;
  rootElement.innerHTML = `
    <section class="error-fallback">
      <div class="error-fallback-card">
        <h2>O frontend encontrou um erro fatal.</h2>
        <p>${serializeError(error)}</p>
        <button type="button" class="primary-small-button" onclick="window.location.reload()">
          Recarregar sistema
        </button>
      </div>
    </section>
  `;
}

window.addEventListener("error", (event) => {
  showFatalError(event.error || event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  showFatalError(event.reason);
});

try {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  showFatalError(error);
}
