import { Bell, CalendarDays, Menu } from "lucide-react";
import { getDateLabel } from "../utils/helpers";

export function Topbar({
  title,
  subtitle,
  breadcrumb,
  currentUser,
  notificationsCount,
  onToggleSidebar,
  onToggleNotifications
}) {
  return (
    <>
      <header className="topbar">
        <div className="topbar-title-row">
          <button type="button" className="menu-chip" onClick={onToggleSidebar} aria-label="Alternar menu lateral">
            <Menu size={22} strokeWidth={2.1} />
          </button>
          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
            {breadcrumb ? <div className="breadcrumb">{breadcrumb}</div> : null}
          </div>
        </div>
        <div className="topbar-user">
          <button type="button" className="notification-chip" onClick={onToggleNotifications} aria-label="Abrir notificacoes">
            <Bell size={21} strokeWidth={2.1} />
            {notificationsCount ? <span>{notificationsCount}</span> : null}
          </button>
          <div className="user-chip-avatar">
            {currentUser.foto ? <img src={currentUser.foto} alt={currentUser.nome} /> : currentUser.avatar}
          </div>
          <div className="user-chip-text">
            <strong>{currentUser.nome}</strong>
            <span>{currentUser.perfil}</span>
          </div>
        </div>
      </header>
      <div className="date-row">
        <CalendarDays size={16} strokeWidth={2} />
        <span>{getDateLabel()}</span>
      </div>
    </>
  );
}
