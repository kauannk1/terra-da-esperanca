import { FileText, Package, TriangleAlert, UserRound, Users } from "lucide-react";
import { MetricCard } from "../components/MetricCard";
import { StatusPill } from "./shared/ViewPrimitives";

export function DashboardView({ counts, stockAlerts, inventory, shifts, activities, onAction }) {
  const criticalItems = inventory.filter((item) => item.status !== "Adequado");

  return (
    <>
      <section className="metrics-grid">
        <MetricCard
          title="Total de acolhidos"
          value={counts.total}
          sub="Ativos"
          icon={<Users size={26} strokeWidth={2} />}
          tone="purple"
          foot="↑ 8% em relacao ao mes passado"
          positive
        />
        <MetricCard
          title="Vagas masculinas"
          value={`${counts.masculino} / 10`}
          sub="Ocupacao atual"
          icon={<UserRound size={24} strokeWidth={2} />}
          tone="blue"
          bar={`${Math.min(100, counts.masculino * 10)}%`}
          foot={`${counts.masculino * 10}% ocupadas`}
        />
        <MetricCard
          title="Vagas femininas"
          value={`${counts.feminino} / 10`}
          sub="Ocupacao atual"
          icon={<UserRound size={24} strokeWidth={2} />}
          tone="pink"
          bar={`${Math.min(100, counts.feminino * 10)}%`}
          foot={`${counts.feminino * 10}% ocupadas`}
        />
        <MetricCard
          title="Alertas de estoque"
          value={stockAlerts.length}
          sub="Itens monitorados"
          icon={<TriangleAlert size={24} strokeWidth={2} />}
          tone="amber"
          foot="Ver detalhes"
        />
      </section>

      <section className="dashboard-main-grid">
        <article className="panel-card dashboard-shifts-card">
          <div className="panel-header">
            <h3>Proximos plantoes</h3>
            <button type="button" className="text-link" onClick={() => onAction("go-escalas")}>Ver todos</button>
          </div>
          <div className="shift-list">
            {shifts.map((shift) => (
              <div key={`${shift.id}-${shift.inicio_plantao}`} className="shift-item">
                <div className="shift-date">
                  <strong>{shift.inicio_plantao.split("/")[0]}</strong>
                  <span>JUN</span>
                </div>
                <div className="shift-content">
                  <div className="shift-info">
                    <strong>{shift.especialidade}</strong>
                    <span>{shift.inicio_plantao.split(" ")[1]} - {shift.fim_plantao.split(" ")[1]}</span>
                  </div>
                  <div className="shift-person">
                    <div className="mini-avatar">
                      {shift.foto ? <img src={shift.foto} alt={shift.nome} /> : shift.avatar}
                    </div>
                    <div>
                      <strong>{shift.nome}</strong>
                      <span>{shift.cargo}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel-card dashboard-gender-card">
          <div className="panel-header"><h3>Acolhidos por genero</h3></div>
          <div className="gender-chart">
            <div className="donut-chart" style={{ "--male": counts.masculino, "--female": counts.feminino }}>
              <div className="donut-center">
                <strong>{counts.total}</strong>
                <span>Total</span>
              </div>
            </div>
            <div className="gender-side left">
              <strong>{counts.masculino}</strong>
              <span>Masculino</span>
              <small>{counts.total ? ((counts.masculino / counts.total) * 100).toFixed(1) : "0"}%</small>
            </div>
            <div className="gender-side right">
              <strong>{counts.feminino}</strong>
              <span>Feminino</span>
              <small>{counts.total ? ((counts.feminino / counts.total) * 100).toFixed(1) : "0"}%</small>
            </div>
          </div>
          <div className="gender-legend">
            <span><i className="dot male" /> Masculino ({counts.masculino})</span>
            <span><i className="dot female" /> Feminino ({counts.feminino})</span>
          </div>
        </article>

        <article className="panel-card dashboard-activity-card">
          <div className="panel-header">
            <h3>Atividades recentes</h3>
            <button type="button" className="text-link" onClick={() => onAction("go-auditoria")}>Ver todas</button>
          </div>
          <div className="activity-list">
            {activities.map((item) => (
              <div key={`${item.titulo}-${item.detalhe}-${item.tempo}`} className="activity-item">
                <div className="activity-icon"><FileText size={18} strokeWidth={2} /></div>
                <div className="activity-body">
                  <div className="activity-heading">
                    <strong>{item.titulo}</strong>
                    <small>{item.tempo}</small>
                  </div>
                  <span>{item.detalhe}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="panel-card wide-card">
        <div className="panel-header"><h3>Alertas de estoque</h3></div>
        <div className="table-scroll">
          <table className="data-table dashboard-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Categoria</th>
                <th>Estoque atual</th>
                <th>Unidade</th>
                <th>Nivel de alerta</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {criticalItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.item}</td>
                  <td>{item.categoria}</td>
                  <td>{item.estoqueAtual}</td>
                  <td>{item.unidade}</td>
                  <td><StatusPill status={item.status} /></td>
                  <td>
                    <button type="button" className="inline-link" onClick={() => onAction("view-stock-item", item.id)}>
                      Ver item
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="wide-card-footer">
          <button type="button" className="outline-button" onClick={() => onAction("go-estoque")}>
            <Package size={16} strokeWidth={2} />
            <span>Ver todos os itens em estoque</span>
          </button>
        </div>
      </section>
    </>
  );
}
