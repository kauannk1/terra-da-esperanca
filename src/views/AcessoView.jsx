import { BellRing, ImageUp, LockKeyhole, PencilLine, Search, ShieldAlert, UserCheck, Users } from "lucide-react";
import { useState } from "react";
import { MetricCard } from "../components/MetricCard";
import { formatCpf, formatPhone } from "../utils/helpers";
import { AvatarBadge, Badge, StatusPill } from "./shared/ViewPrimitives";

export function AcessoView({ currentUser, users, passwordRequests, supportContacts, onCreateUser, onAction }) {
  const [query, setQuery] = useState("");
  const [profileFilter, setProfileFilter] = useState("Todos");

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const success = await onCreateUser(new FormData(form));
    if (success !== false) {
      form.reset();
    }
  };

  const filteredUsers = users.filter((user) => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery = !normalizedQuery
      || user.nome.toLowerCase().includes(normalizedQuery)
      || user.email.toLowerCase().includes(normalizedQuery)
      || formatCpf(user.cpf).includes(normalizedQuery)
      || (user.telefone || "").toLowerCase().includes(normalizedQuery);
    const matchesProfile = profileFilter === "Todos" || user.perfil === profileFilter;
    return matchesQuery && matchesProfile;
  });

  if (currentUser.perfil !== "Administrador") {
    return (
      <div className="access-layout">
        <article className="panel-card">
          <div className="panel-header"><h3>Meu acesso</h3></div>
          <div className="profile-summary-card">
            <AvatarBadge person={currentUser} className="profile-avatar-large" />
            <div className="profile-summary-text">
              <strong>{currentUser.nome}</strong>
              <span>{currentUser.email}</span>
              <span>CPF: {formatCpf(currentUser.cpf)}</span>
              <span>Perfil: {currentUser.perfil}</span>
            </div>
          </div>
        </article>

        <article className="panel-card">
          <div className="panel-header"><h3>Suporte administrativo</h3></div>
          <div className="compact-list">
            <div className="movement-item">
              <strong>Alteracao de dados</strong>
              <span>Atualizacoes cadastrais e trocas de perfil devem ser solicitadas a gerencia.</span>
            </div>
            <div className="movement-item">
              <strong>Recuperacao de senha</strong>
              <span>Use o link "Esqueci minha senha" na tela inicial ou entre em contato com {supportContacts.email}.</span>
            </div>
            <div className="movement-item">
              <strong>Contato</strong>
              <span>{supportContacts.telefone} • {supportContacts.horario}</span>
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="access-layout">
      <section className="metrics-grid">
        <MetricCard title="Usuarios ativos" value={users.filter((user) => user.ativo !== false).length} sub="contas habilitadas" icon={<Users size={24} strokeWidth={2} />} tone="purple" foot="Controle administrativo" />
        <MetricCard title="Administradores" value={users.filter((user) => user.perfil === "Administrador" && user.ativo !== false).length} sub="gestao do sistema" icon={<ShieldAlert size={24} strokeWidth={2} />} tone="blue" foot="Perfis com privilegios" />
        <MetricCard title="Tecnicos" value={users.filter((user) => user.perfil === "Tecnico" && user.ativo !== false).length} sub="operacao diaria" icon={<UserCheck size={24} strokeWidth={2} />} tone="green" foot="Equipe operacional" />
        <MetricCard title="Solicitacoes pendentes" value={passwordRequests.filter((item) => item.status === "Pendente").length} sub="recuperacao de senha" icon={<BellRing size={24} strokeWidth={2} />} tone="amber" foot="Atendimento administrativo" />
      </section>

      <div className="access-admin-grid">
        <article className="panel-card">
          <div className="panel-header">
            <div>
              <h3>Novo usuario</h3>
              <p>Cadastre contas de tecnico ou administracao.</p>
            </div>
          </div>
          <form className="modal-form" onSubmit={handleCreateSubmit}>
            <label><span>Nome</span><input name="nome" required /></label>
            <label><span>E-mail</span><input name="email" type="email" required /></label>
            <label><span>CPF</span><input name="cpf" placeholder="000.000.000-00" onInput={(event) => { event.currentTarget.value = formatCpf(event.currentTarget.value); }} required /></label>
            <label><span>Telefone</span><input name="telefone" placeholder="(16) 99999-9999" onInput={(event) => { event.currentTarget.value = formatPhone(event.currentTarget.value); }} /></label>
            <label>
              <span>Perfil</span>
              <select name="perfil" defaultValue="Tecnico">
                <option value="Tecnico">Tecnico</option>
                <option value="Administrador">Administrador</option>
              </select>
            </label>
            <label><span>Senha provisoria</span><input name="senha" minLength={4} required /></label>
            <label><span>Foto do perfil (opcional)</span><input name="foto" type="file" accept="image/*" /></label>
            <div className="form-actions-row top-gap">
              <button type="reset" className="ghost-form-button">Limpar</button>
              <button type="submit" className="save-button">
                <ImageUp size={16} strokeWidth={2} />
                <span>Cadastrar usuario</span>
              </button>
            </div>
          </form>
        </article>

        <article className="panel-card">
          <div className="panel-header"><h3>Solicitacoes de senha</h3></div>
          <div className="compact-list">
            {passwordRequests.length ? passwordRequests.map((request) => (
              <div key={request.id} className="movement-item">
                <strong>{request.nome}</strong>
                <span>{request.contato}</span>
                <small>{request.data}</small>
                <div className="inline-actions-row">
                  <Badge tone={request.status === "Pendente" ? "amber" : "green"}>{request.status}</Badge>
                  {request.status === "Pendente" ? (
                    <button
                      type="button"
                      className="inline-link"
                      onClick={() => onAction("reset-user-password", request.userId)}
                    >
                      Atender
                    </button>
                  ) : null}
                </div>
              </div>
            )) : (
              <div className="movement-item">
                <strong>Sem solicitacoes pendentes</strong>
                <span>Nenhum pedido de redefinicao de senha foi registrado ate o momento.</span>
              </div>
            )}
          </div>
        </article>
      </div>

      <article className="panel-card wide-card">
        <div className="panel-header">
          <div>
            <h3>Usuarios cadastrados</h3>
            <p>Gerencie perfis, status de acesso e redefinicao de senha.</p>
          </div>
        </div>
        <div className="table-toolbar">
          <div className="search-field">
            <Search size={17} strokeWidth={2.1} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nome, e-mail, CPF ou telefone"
            />
          </div>
          <select value={profileFilter} onChange={(event) => setProfileFilter(event.target.value)}>
            {["Todos", "Administrador", "Tecnico"].map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>E-mail</th>
                <th>CPF</th>
                <th>Perfil</th>
                <th>Status</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length ? filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="table-user-cell">
                      <AvatarBadge person={user} />
                      <div>
                        <strong>{user.nome}</strong>
                        <span>{user.telefone || "Sem telefone"}</span>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{formatCpf(user.cpf)}</td>
                  <td>{user.perfil}</td>
                  <td><StatusPill status={user.ativo !== false ? "Ativo" : "Inativo"} /></td>
                  <td>
                    <div className="table-actions">
                      <button type="button" onClick={() => onAction("edit-user", user.id)} aria-label={`Editar ${user.nome}`}>
                        <PencilLine size={16} strokeWidth={2} />
                      </button>
                      <button type="button" onClick={() => onAction("reset-user-password", user.id)} aria-label={`Redefinir senha de ${user.nome}`}>
                        <LockKeyhole size={16} strokeWidth={2} />
                      </button>
                      <button type="button" onClick={() => onAction("toggle-user-status", user.id)} aria-label={`Alterar status de ${user.nome}`}>
                        <ShieldAlert size={16} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="empty-table">Nenhum usuario encontrado para os filtros aplicados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}
