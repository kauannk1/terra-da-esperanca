import { Info, X } from "lucide-react";
import { formatCpf } from "../utils/helpers";

function Wrapper({ title, children, wide, onClose }) {
  return (
    <div className="modal-overlay" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className={`modal-card ${wide ? "modal-card-wide" : ""}`}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button type="button" onClick={onClose} aria-label="Fechar modal">
            <X size={18} strokeWidth={2.1} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function submitFactory(handler, onClose, payload) {
  return async (event) => {
    event.preventDefault();
    const result = await handler(new FormData(event.currentTarget), payload);
    if (result !== false) onClose();
  };
}

export function Modal({
  modal,
  currentUser,
  medicalTimeline,
  alerts,
  supportContacts,
  onClose,
  onForgotPassword,
  onNewTriagem,
  onNewItem,
  onNewDonation,
  onNewDoador,
  onAdjustStockItem,
  onUpdateUser
}) {
  if (!modal) return null;

  if (modal.type === "forgot-password") {
    return (
      <Wrapper title="Recuperacao de senha" onClose={onClose}>
        <p className="modal-copy">Informe seu e-mail ou CPF. A solicitacao sera encaminhada para a administracao da instituicao.</p>
        <form className="modal-form" onSubmit={submitFactory(onForgotPassword, onClose)}>
          <label><span>E-mail ou CPF</span><input name="login" placeholder="Digite seu e-mail ou CPF" required /></label>
          <div className="modal-actions">
            <button type="button" className="ghost-form-button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="save-button">Solicitar atendimento</button>
          </div>
        </form>
      </Wrapper>
    );
  }

  if (modal.type === "help-admin") {
    return (
      <Wrapper title="Falar com a administracao" onClose={onClose}>
        <p className="modal-copy">Contato de apoio: {supportContacts.email} ou {supportContacts.telefone}.</p>
        <p className="modal-copy">Horario de atendimento: {supportContacts.horario}.</p>
        <div className="modal-actions">
          <button type="button" className="save-button" onClick={onClose}>Fechar</button>
        </div>
      </Wrapper>
    );
  }

  if (modal.type === "timeline-view") {
    return (
      <Wrapper title="Linha do tempo completa" onClose={onClose} wide>
        <div className="notifications-list">
          {medicalTimeline.map((item) => (
            <div key={`${item.data}-${item.hora}-${item.titulo}`} className="notification-item">
              <strong>{item.data} {item.hora}</strong>
              <p>{item.titulo}</p>
              <span>{item.autor}</span>
            </div>
          ))}
        </div>
      </Wrapper>
    );
  }

  if (modal.type === "alerts-view") {
    return (
      <Wrapper title="Alertas e observacoes" onClose={onClose} wide>
        <div className="notifications-list">
          {alerts.map((alerta) => (
            <div key={`${alerta.tipo}-${alerta.data}-${alerta.texto}`} className="notification-item">
              <strong>{alerta.tipo}</strong>
              <p>{alerta.texto}</p>
              <span>{alerta.data}</span>
            </div>
          ))}
        </div>
      </Wrapper>
    );
  }

  if (modal.type === "stock-item-info") {
    return (
      <Wrapper title="Detalhes do item" onClose={onClose}>
        <div className="modal-copy modal-copy-stack">
          <p><strong>{modal.payload.item}</strong></p>
          <p>Categoria: {modal.payload.categoria}</p>
          <p>Estoque atual: {modal.payload.estoqueAtual} {modal.payload.unidade}</p>
          <p>Estoque minimo: {modal.payload.estoqueMinimo}</p>
          <p>Status: {modal.payload.status}</p>
        </div>
      </Wrapper>
    );
  }

  if (modal.type === "edit-user") {
    return (
      <Wrapper title="Editar usuario" onClose={onClose}>
        <form className="modal-form" onSubmit={submitFactory(onUpdateUser, onClose, modal.payload.id)}>
          <label><span>Nome</span><input name="nome" defaultValue={modal.payload.nome} required /></label>
          <label><span>E-mail</span><input name="email" type="email" defaultValue={modal.payload.email} required /></label>
          <label>
            <span>CPF</span>
            <input
              name="cpf"
              defaultValue={formatCpf(modal.payload.cpf)}
              required
              onInput={(event) => {
                event.currentTarget.value = formatCpf(event.currentTarget.value);
              }}
            />
          </label>
          <label><span>Telefone</span><input name="telefone" defaultValue={modal.payload.telefone || ""} /></label>
          <label>
            <span>Perfil</span>
            <select name="perfil" defaultValue={modal.payload.perfil}>
              <option value="Administrador">Administrador</option>
              <option value="Tecnico">Tecnico</option>
            </select>
          </label>
          <label>
            <span>Status</span>
            <select name="ativo" defaultValue={String(modal.payload.ativo !== false)}>
              <option value="true">Ativo</option>
              <option value="false">Inativo</option>
            </select>
          </label>
          <label><span>Nova senha (opcional)</span><input name="senha" minLength={4} placeholder="Manter senha atual" /></label>
          <label><span>Foto do perfil (opcional)</span><input name="foto" type="file" accept="image/*" /></label>
          <div className="modal-actions">
            <button type="button" className="ghost-form-button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="save-button">Salvar alteracoes</button>
          </div>
        </form>
      </Wrapper>
    );
  }

  if (modal.type === "new-triagem") {
    return (
      <Wrapper title="Nova triagem" onClose={onClose}>
        <form className="modal-form" onSubmit={submitFactory(onNewTriagem, onClose)}>
          <label><span>Nome do candidato</span><input name="nome_candidato" required /></label>
          <label>
            <span>CPF</span>
            <input
              name="cpf"
              placeholder="000.000.000-00"
              required
              onInput={(event) => {
                event.currentTarget.value = formatCpf(event.currentTarget.value);
              }}
            />
          </label>
          <label><span>Resultado</span><select name="resultado"><option>Apto</option><option>Inapto</option></select></label>
          <label><span>Profissional</span><input name="profissional" defaultValue={currentUser.nome} /></label>
          <label><span>Observacao</span><textarea name="observacao" rows="4" /></label>
          <div className="modal-actions">
            <button type="button" className="ghost-form-button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="save-button">Salvar triagem</button>
          </div>
        </form>
      </Wrapper>
    );
  }

  if (modal.type === "new-item") {
    return (
      <Wrapper title="Novo item de estoque" onClose={onClose}>
        <form className="modal-form" onSubmit={submitFactory(onNewItem, onClose)}>
          <label><span>Nome do item</span><input name="item" required /></label>
          <label><span>Categoria</span><select name="categoria"><option>Alimenticios</option><option>Higiene</option><option>Limpeza</option><option>Vestuario</option></select></label>
          <label><span>Estoque atual</span><input name="estoqueAtual" type="number" min="0" required /></label>
          <label><span>Unidade</span><input name="unidade" defaultValue="un" required /></label>
          <label><span>Estoque minimo</span><input name="estoqueMinimo" type="number" min="0" required /></label>
          <label><span>Valor unitario</span><input name="valor" placeholder="R$ 0,00" required /></label>
          <div className="modal-actions">
            <button type="button" className="ghost-form-button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="save-button">Salvar item</button>
          </div>
        </form>
      </Wrapper>
    );
  }

  if (modal.type === "new-donation") {
    return (
      <Wrapper title="Registrar doacao" onClose={onClose}>
        <form className="modal-form" onSubmit={submitFactory(onNewDonation, onClose)}>
          <label><span>Doador</span><input name="doador" required /></label>
          <label><span>Tipo</span><select name="tipo"><option>PF</option><option>PJ</option></select></label>
          <label><span>Item</span><input name="item" required /></label>
          <label><span>Categoria</span><select name="categoria"><option>Alimenticios</option><option>Higiene</option><option>Limpeza</option><option>Vestuario</option></select></label>
          <label><span>Quantidade</span><input name="quantidade" type="number" min="1" required /></label>
          <label><span>Unidade</span><input name="unidade" defaultValue="un" required /></label>
          <label><span>Destino</span><input name="destino" required /></label>
          <div className="modal-actions">
            <button type="button" className="ghost-form-button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="save-button">Salvar doacao</button>
          </div>
        </form>
      </Wrapper>
    );
  }

  if (modal.type === "new-doador") {
    return (
      <Wrapper title="Novo doador" onClose={onClose}>
        <form className="modal-form" onSubmit={submitFactory(onNewDoador, onClose)}>
          <label><span>Nome / Razao social</span><input name="nome_doador" required /></label>
          <label><span>Tipo</span><select name="tipo_doador"><option>PF</option><option>PJ</option></select></label>
          <label><span>Ultima doacao</span><input name="ultima_doacao" required /></label>
          <div className="modal-actions">
            <button type="button" className="ghost-form-button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="save-button">Salvar doador</button>
          </div>
        </form>
      </Wrapper>
    );
  }

  if (modal.type === "adjust-stock-item") {
    return (
      <Wrapper title="Ajustar estoque" onClose={onClose}>
        <form className="modal-form" onSubmit={submitFactory((formData) => onAdjustStockItem(formData, modal.payload.id), onClose)}>
          <div className="notification-item">
            <strong>{modal.payload.item}</strong>
            <span>{modal.payload.categoria} • {modal.payload.estoqueAtual} {modal.payload.unidade}</span>
          </div>
          <label><span>Tipo</span><select name="tipo"><option>Entrada</option><option>Saida</option></select></label>
          <label><span>Quantidade</span><input name="quantidade" type="number" min="1" required /></label>
          <label><span>Observacao</span><input name="observacao" placeholder="Ajuste manual" defaultValue="Ajuste manual" /></label>
          <div className="modal-actions">
            <button type="button" className="ghost-form-button" onClick={onClose}>Cancelar</button>
            <button type="submit" className="save-button">Aplicar ajuste</button>
          </div>
        </form>
      </Wrapper>
    );
  }

  return (
    <Wrapper title="Informacao" onClose={onClose}>
      <div className="notification-item">
        <div className="modal-inline-icon">
          <Info size={18} strokeWidth={2} />
        </div>
        <p className="modal-copy">Nenhum conteudo disponivel para esta janela.</p>
      </div>
      <div className="modal-actions">
        <button type="button" className="save-button" onClick={onClose}>Fechar</button>
      </div>
    </Wrapper>
  );
}
