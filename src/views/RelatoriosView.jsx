import { ClipboardList, Download, ShieldAlert, UserCheck, Users } from "lucide-react";
import { MetricCard } from "../components/MetricCard";

export function RelatoriosView({ counts, triagens, doadores, donations, auditLogs, inventory, residents, onAction }) {
  return (
    <>
      <section className="metrics-grid">
        <MetricCard title="Acolhidos ativos" value={counts.total} sub="base atual" icon={<Users size={24} strokeWidth={2} />} tone="purple" foot="Painel consolidado" />
        <MetricCard title="Triagens registradas" value={triagens.length} sub="historico recente" icon={<ClipboardList size={24} strokeWidth={2} />} tone="blue" foot="Fluxo de admissao" />
        <MetricCard title="Doadores ativos" value={doadores.length} sub="parcerias vigentes" icon={<UserCheck size={24} strokeWidth={2} />} tone="green" foot="Rede de apoio" />
        <MetricCard title="Logs de auditoria" value={auditLogs.length} sub="rastreabilidade" icon={<ShieldAlert size={24} strokeWidth={2} />} tone="amber" foot="Governanca" />
      </section>
      <section className="panel-card wide-card">
        <div className="panel-header">
          <div>
            <h3>Resumo executivo</h3>
            <p>Indicadores consolidados para acompanhamento gerencial.</p>
          </div>
          <button type="button" className="outline-button" onClick={() => onAction("export-executive-report")}>
            <Download size={16} strokeWidth={2.1} />
            <span>Exportar resumo</span>
          </button>
        </div>
        <div className="status-grid">
          <div><span>Vagas masculinas</span><strong>{counts.masculino} / 10</strong></div>
          <div><span>Vagas femininas</span><strong>{counts.feminino} / 10</strong></div>
          <div><span>Itens criticos</span><strong>{inventory.filter((item) => item.status === "Critico").length}</strong></div>
          <div><span>Acolhidos com apoio psicologico</span><strong>{residents.filter((resident) => resident.acompanhamentoPsicologico === "Sim").length}</strong></div>
          <div><span>Doacoes recentes</span><strong>{donations.length}</strong></div>
          <div><span>Registros de auditoria</span><strong>{auditLogs.length}</strong></div>
        </div>
      </section>
      <section className="panel-card wide-card">
        <div className="panel-header"><h3>Pontos de atencao</h3></div>
        <div className="compact-list">
          {inventory.filter((item) => item.status === "Critico" || item.status === "Baixo").slice(0, 5).map((item) => (
            <div key={`${item.id}-report-alert`} className="movement-item">
              <strong>{item.item}</strong>
              <span>{item.categoria}</span>
              <small>{item.status} • {item.estoqueAtual} {item.unidade} disponiveis</small>
            </div>
          ))}
          {!inventory.some((item) => item.status === "Critico" || item.status === "Baixo") ? (
            <div className="movement-item">
              <strong>Sem alertas criticos</strong>
              <span>O estoque principal permanece dentro dos limites esperados.</span>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
