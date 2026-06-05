import { Plus } from "lucide-react";
import { formatDate } from "../utils/helpers";
import { StatusPill } from "./shared/ViewPrimitives";

export function TriagensView({ triagens, onAction }) {
  return (
    <section className="panel-card wide-card">
      <div className="panel-header">
        <div>
          <h3>Triagens registradas</h3>
          <p>Historico das entrevistas iniciais e decisao de acolhimento.</p>
        </div>
        <button type="button" className="primary-small-button" onClick={() => onAction("new-triagem")}>
          <Plus size={16} strokeWidth={2.2} />
          <span>Nova triagem</span>
        </button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Candidato</th>
            <th>CPF</th>
            <th>Resultado</th>
            <th>Profissional</th>
            <th>Data</th>
            <th>Observacao</th>
          </tr>
        </thead>
        <tbody>
          {triagens.map((item) => (
            <tr key={item.id_triagem}>
              <td>{item.id_triagem}</td>
              <td>{item.nome_candidato}</td>
              <td>{item.cpf}</td>
              <td><StatusPill status={item.resultado} /></td>
              <td>{item.profissional}</td>
              <td>{formatDate(item.data)}</td>
              <td>{item.observacao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
