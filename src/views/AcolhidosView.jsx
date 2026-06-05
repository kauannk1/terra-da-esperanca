import { Search } from "lucide-react";
import { useState } from "react";
import { formatDate } from "../utils/helpers";
import { StatusPill } from "./shared/ViewPrimitives";

export function AcolhidosView({ residents, onOpenProntuario }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");

  const filteredResidents = residents.filter((resident) => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery = !normalizedQuery
      || resident.nome.toLowerCase().includes(normalizedQuery)
      || resident.cpf.toLowerCase().includes(normalizedQuery)
      || resident.origem.toLowerCase().includes(normalizedQuery);
    const matchesStatus = status === "Todos" || resident.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <section className="panel-card wide-card">
      <div className="panel-header">
        <div>
          <h3>Lista de acolhidos</h3>
          <p>Consulte rapidamente por nome, CPF, origem ou situacao atual.</p>
        </div>
        <span className="panel-header-counter">{filteredResidents.length} exibidos</span>
      </div>
      <div className="table-toolbar">
        <div className="search-field">
          <Search size={17} strokeWidth={2.1} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar acolhido por nome, CPF ou origem"
          />
        </div>
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          {["Todos", "Ativo", "Inativo", "Desligado", "Ressocializado"].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Genero</th>
              <th>Origem</th>
              <th>Data</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidents.length ? filteredResidents.map((resident) => (
              <tr key={resident.id} data-open-prontuario="true" onClick={() => onOpenProntuario(resident.id)}>
                <td>{resident.nome}</td>
                <td>{resident.cpf}</td>
                <td>{resident.genero}</td>
                <td>{resident.origem}</td>
                <td>{formatDate(resident.dataAcolhimento)}</td>
                <td><StatusPill status={resident.status} /></td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="empty-table">Nenhum acolhido encontrado para os filtros atuais.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
