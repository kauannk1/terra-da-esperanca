import { Plus } from "lucide-react";

export function DoadoresView({ doadores, onAction }) {
  return (
    <section className="panel-card wide-card">
      <div className="panel-header">
        <div>
          <h3>Doadores</h3>
          <p>Parceiros cadastrados para apoio com itens e suprimentos.</p>
        </div>
        <button type="button" className="primary-small-button" onClick={() => onAction("new-doador")}>
          <Plus size={16} strokeWidth={2.1} />
          <span>Novo doador</span>
        </button>
      </div>
      <table className="data-table">
        <thead><tr><th>ID Doador</th><th>Nome / Razao social</th><th>Tipo</th><th>Ultima doacao</th></tr></thead>
        <tbody>
          {doadores.map((doador) => (
            <tr key={doador.id_doador}>
              <td>{doador.id_doador}</td>
              <td>{doador.nome_doador}</td>
              <td>{doador.tipo_doador}</td>
              <td>{doador.ultima_doacao}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
