import { Plus } from "lucide-react";

export function DoacoesView({ donations, onAction }) {
  return (
    <section className="panel-card wide-card">
      <div className="panel-header">
        <div>
          <h3>Historico de doacoes</h3>
          <p>Entradas registradas por parceiros e apoiadores da instituicao.</p>
        </div>
        <button type="button" className="primary-small-button" onClick={() => onAction("new-donation")}>
          <Plus size={16} strokeWidth={2.1} />
          <span>Registrar doacao</span>
        </button>
      </div>
      <table className="data-table">
        <thead><tr><th>Data</th><th>Doador</th><th>Tipo</th><th>Item</th><th>Quantidade</th><th>Destino</th></tr></thead>
        <tbody>
          {donations.map((item, index) => (
            <tr key={`${item.data}-${item.item}-${index}`}>
              <td>{item.data}</td>
              <td>{item.doador}</td>
              <td>{item.tipo}</td>
              <td>{item.item}</td>
              <td>{item.quantidade}</td>
              <td>{item.destino}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
