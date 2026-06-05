import { Download, Search } from "lucide-react";
import { useState } from "react";

export function AuditoriaView({ auditLogs, onAction }) {
  const [query, setQuery] = useState("");
  const filteredLogs = auditLogs.filter((log) => {
    const normalizedQuery = query.trim().toLowerCase();
    return !normalizedQuery
      || log.acao.toLowerCase().includes(normalizedQuery)
      || log.modulo.toLowerCase().includes(normalizedQuery)
      || log.usuario.toLowerCase().includes(normalizedQuery)
      || log.data.toLowerCase().includes(normalizedQuery);
  });

  return (
    <section className="panel-card wide-card">
      <div className="panel-header">
        <div>
          <h3>Auditoria</h3>
          <p>Historico das principais acoes realizadas no sistema.</p>
        </div>
        <button type="button" className="outline-button" onClick={() => onAction("export-audit-report")}>
          <Download size={16} strokeWidth={2.1} />
          <span>Exportar CSV</span>
        </button>
      </div>
      <div className="table-toolbar">
        <div className="search-field">
          <Search size={17} strokeWidth={2.1} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por acao, modulo, usuario ou data"
          />
        </div>
      </div>
      <div className="table-scroll">
        <table className="data-table">
          <thead><tr><th>Data / Hora</th><th>Acao</th><th>Modulo</th><th>Usuario</th></tr></thead>
          <tbody>
            {filteredLogs.length ? filteredLogs.map((log, index) => (
              <tr key={`${log.data}-${log.acao}-${index}`}>
                <td>{log.data}</td>
                <td>{log.acao}</td>
                <td>{log.modulo}</td>
                <td>{log.usuario}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="empty-table">Nenhum log encontrado para a busca informada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
