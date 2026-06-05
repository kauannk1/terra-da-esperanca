import { getInitials } from "../../utils/helpers";

export function StatusPill({ status }) {
  const tone = status === "Adequado" || status === "Ativo" || status === "Apto" || status === "Disponivel" || status === "Monitorado" || status === "Concluida" || status === "Atendido" || status === "Dispensado"
    ? "success"
    : status === "Baixo" || status === "Inapto" || status === "Atencao" || status === "Pendente"
      ? "warning"
      : "danger";
  return <span className={`status-pill ${tone}`}>{status}</span>;
}

export function Badge({ children, tone = "green" }) {
  return <strong className={`badge ${tone}`}>{children}</strong>;
}

export function AvatarBadge({ person, className = "" }) {
  return (
    <div className={`avatar-badge ${className}`.trim()}>
      {person?.foto ? <img src={person.foto} alt={person.nome} /> : getInitials(person?.nome || person?.avatar || "")}
    </div>
  );
}
