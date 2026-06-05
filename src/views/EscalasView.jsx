import { CalendarDays } from "lucide-react";
import { StatusPill } from "./shared/ViewPrimitives";

export function EscalasView({ volunteers, dailyActivities, onAction }) {
  return (
    <>
      <section className="panel-card wide-card">
        <div className="panel-header">
          <div>
            <h3>Escalas dos voluntarios</h3>
            <p>Plantoes previstos para garantir cobertura da equipe durante a semana.</p>
          </div>
          <button type="button" className="primary-small-button" onClick={() => onAction("publish-schedule")}>
            <CalendarDays size={16} strokeWidth={2.1} />
            <span>Publicar escala</span>
          </button>
        </div>
        <table className="data-table">
          <thead><tr><th>ID Escala</th><th>Voluntario</th><th>Especialidade</th><th>Inicio do plantao</th><th>Fim do plantao</th></tr></thead>
          <tbody>
            {volunteers.map((item, index) => (
              <tr key={item.id}>
                <td>ESC-00{index + 1}</td>
                <td>{item.nome}</td>
                <td>{item.especialidade}</td>
                <td>{item.inicio_plantao}</td>
                <td>{item.fim_plantao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel-card wide-card">
        <div className="panel-header"><h3>Atividades do cotidiano</h3></div>
        <table className="data-table">
          <thead><tr><th>ID Atividade</th><th>Acolhido</th><th>Tarefa</th><th>Status</th></tr></thead>
          <tbody>
            {dailyActivities.map((activity) => (
              <tr key={activity.id_atividade}>
                <td>{activity.id_atividade}</td>
                <td>{activity.acolhido}</td>
                <td>{activity.tarefa}</td>
                <td><StatusPill status={activity.status ? "Concluida" : "Pendente"} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
