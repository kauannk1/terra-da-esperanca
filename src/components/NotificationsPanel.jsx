import { sameId } from "../utils/helpers";
import { Bell, X } from "lucide-react";

export function NotificationsPanel({
  open,
  stockAlerts,
  alerts,
  residents,
  passwordRequests,
  currentUser,
  onClose,
  onNavigate
}) {
  if (!open) return null;

  function handleNavigate(view, residentId = null) {
    onClose();
    onNavigate(view, residentId);
  }

  return (
    <aside className="notifications-panel">
      <div className="notifications-header">
        <div>
          <h3>Notificacoes</h3>
          <p>Resumo das ocorrencias mais recentes do sistema.</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Fechar notificacoes">
          <X size={18} strokeWidth={2.1} />
        </button>
      </div>
      <div className="notifications-list">
        {stockAlerts.map((alerta) => (
          <button
            key={`${alerta.item}-${alerta.descricao}`}
            type="button"
            className="notification-item actionable"
            aria-label={`Abrir estoque: ${alerta.item}`}
            onClick={() => handleNavigate("estoque")}
          >
            <strong>Estoque</strong>
            <p>{alerta.item}</p>
            <span>{alerta.descricao}</span>
          </button>
        ))}
        {alerts.map((alerta) => (
          <button
            key={`${alerta.tipo}-${alerta.data}-${alerta.texto}`}
            type="button"
            className="notification-item actionable"
            aria-label={`Abrir prontuario de ${residents.find((resident) => sameId(resident.id, alerta.residentId))?.nome || "acolhido"}`}
            onClick={() => handleNavigate("prontuario", alerta.residentId)}
          >
            <strong>{alerta.tipo}</strong>
            <p>{residents.find((resident) => sameId(resident.id, alerta.residentId))?.nome || "Acolhido"}</p>
            <span>{alerta.texto}</span>
            <small>{alerta.data}</small>
          </button>
        ))}
        {currentUser.perfil === "Administrador" && passwordRequests.map((request) => (
          <button
            key={request.id}
            type="button"
            className="notification-item actionable"
            aria-label={`Abrir acesso e usuarios para ${request.nome}`}
            onClick={() => handleNavigate("configuracoes")}
          >
            <strong>Acesso</strong>
            <p>Solicitacao de senha: {request.nome}</p>
            <span>{request.data}</span>
          </button>
        ))}
        {!stockAlerts.length && !alerts.length && !(currentUser.perfil === "Administrador" && passwordRequests.length) ? (
          <div className="notification-item empty">
            <div className="modal-inline-icon">
              <Bell size={18} strokeWidth={2} />
            </div>
            <div>
              <strong>Nenhuma notificacao</strong>
              <p>O sistema nao possui alertas pendentes neste momento.</p>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
