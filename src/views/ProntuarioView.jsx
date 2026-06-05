import { AlertTriangle, CalendarDays, CheckCircle2, ClipboardList, FileBadge, FileText, Target } from "lucide-react";
import { formatDate, sameId } from "../utils/helpers";
import { AvatarBadge, Badge, StatusPill } from "./shared/ViewPrimitives";

export function ProntuarioView({
  residents,
  resident,
  currentUser,
  currentTab,
  medicalTimeline,
  alerts,
  onTabChange,
  onAction,
  onSelectResident
}) {
  return (
    <>
      <section className="prontuario-overview-grid">
        <article className="panel-card resident-hero">
          <div className="resident-hero-top">
            <AvatarBadge person={resident} className="resident-avatar-large" />
            <div className="resident-hero-text">
              <div className="resident-name-row">
                <h3>{resident.nome}</h3>
                <StatusPill status={resident.status} />
              </div>
              <p>CPF: {resident.cpf} • {resident.idade} anos • {resident.genero}</p>
              <p>Acolhido em: {formatDate(resident.dataAcolhimento)} • Origem: {resident.origem}</p>
            </div>
          </div>
          <div className="prontuario-tabs">
            {[
              ["resumo", "Resumo"],
              ["historico", "Historico"],
              ["avaliacoes", "Avaliacoes"],
              ["atendimentos", "Atendimentos"],
              ["documentos", "Documentos"],
              ["plano", "Plano de acao"],
              ["anotacoes", "Anotacoes"]
            ].map(([tab, label]) => (
              <button key={tab} type="button" className={`tab-link ${currentTab === tab ? "active" : ""}`} onClick={() => onTabChange(tab)}>
                {label}
              </button>
            ))}
          </div>
        </article>

        <article className="panel-card patient-list-card">
          <div className="panel-header">
            <h3>Acolhidos</h3>
          </div>
          <div className="patient-list">
            {residents.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`patient-list-item ${sameId(item.id, resident.id) ? "active" : ""}`}
                onClick={() => onSelectResident(item.id)}
              >
                <AvatarBadge person={item} />
                <div>
                  <strong>{item.nome}</strong>
                  <span>{item.origem}</span>
                </div>
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="prontuario-grid">
        {currentTab === "historico" ? (
          <article className="panel-card full-width">
            <div className="panel-header"><h3><ClipboardList size={18} strokeWidth={2} /> Historico do acolhido</h3></div>
            <table className="data-table">
              <thead><tr><th>Data</th><th>Evento</th><th>Responsavel</th></tr></thead>
              <tbody>
                {medicalTimeline.map((item) => (
                  <tr key={`${item.data}-${item.hora}-${item.titulo}`}>
                    <td>{item.data} {item.hora}</td>
                    <td>{item.titulo}</td>
                    <td>{item.autor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        ) : null}

        {currentTab === "avaliacoes" ? (
          <article className="panel-card full-width">
            <div className="panel-header"><h3><CheckCircle2 size={18} strokeWidth={2} /> Avaliacoes tecnicas</h3></div>
            <div className="status-grid">
              <div><span>Condicao de saude:</span><Badge>{resident.condicaoSaude}</Badge></div>
              <div><span>Comportamento:</span><Badge>{resident.comportamento}</Badge></div>
              <div><span>Rede de apoio:</span><strong>{resident.redeApoio}</strong></div>
              <div><span>Acompanhamento psicologico:</span><strong>{resident.acompanhamentoPsicologico}</strong></div>
              <div><span>Acompanhamento social:</span><strong>{resident.acompanhamentoSocial}</strong></div>
              <div><span>Status do plano:</span><Badge>{resident.planoStatus}</Badge></div>
            </div>
          </article>
        ) : null}

        {currentTab === "atendimentos" ? (
          <article className="panel-card full-width">
            <div className="panel-header"><h3><FileText size={18} strokeWidth={2} /> Atendimentos registrados</h3></div>
            <table className="data-table">
              <thead><tr><th>Data</th><th>Tipo</th><th>Profissional</th><th>Descricao</th></tr></thead>
              <tbody>
                {medicalTimeline.map((item) => (
                  <tr key={`${item.data}-${item.hora}-${item.titulo}-care`}>
                    <td>{item.data}</td>
                    <td>{item.titulo}</td>
                    <td>{item.autor}</td>
                    <td>Registro relacionado ao acompanhamento tecnico do acolhido.</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        ) : null}

        {currentTab === "documentos" ? (
          <article className="panel-card full-width">
            <div className="panel-header"><h3><FileBadge size={18} strokeWidth={2} /> Documentos vinculados</h3></div>
            <table className="data-table">
              <thead><tr><th>Documento</th><th>Arquivo</th><th>Status</th><th>Acesso</th></tr></thead>
              <tbody>
                {resident.documentos.map((documento) => (
                  <tr key={`${resident.id}-${documento.tipo}`}>
                    <td>{documento.tipo}</td>
                    <td>{documento.nome}</td>
                    <td><StatusPill status={documento.status} /></td>
                    <td>
                      {documento.url ? (
                        <a className="table-link" href={documento.url} target="_blank" rel="noreferrer">
                          Abrir arquivo
                        </a>
                      ) : (
                        <span className="muted-inline">Nao enviado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        ) : null}

        {currentTab === "plano" ? (
          <article className="panel-card full-width">
            <div className="panel-header"><h3><Target size={18} strokeWidth={2} /> Plano de acao atual</h3></div>
            <div className="plan-grid">
              <div><span>Objetivo geral:</span><strong>{resident.objetivoPlano}</strong></div>
              <div><span>Responsavel:</span><strong>{resident.responsavelPlano}</strong></div>
              <div><span>Inicio:</span><strong>{formatDate(resident.dataAcolhimento)}</strong></div>
              <div><span>Revisao prevista:</span><strong>{formatDate(resident.revisaoPrevista)}</strong></div>
              <div><span>Status:</span><Badge>{resident.planoStatus}</Badge></div>
            </div>
            <div className="plan-footer">
              <button type="button" className="primary-small-button" onClick={() => onAction("update-plan")}>
                <Target size={16} strokeWidth={2.1} />
                <span>Atualizar plano</span>
              </button>
            </div>
          </article>
        ) : null}

        {currentTab === "anotacoes" ? (
          <article className="panel-card full-width">
            <div className="panel-header"><h3><ClipboardList size={18} strokeWidth={2} /> Anotacoes tecnicas</h3></div>
            <div className="compact-list">
              {medicalTimeline.map((item) => (
                <div key={`${item.data}-${item.hora}-${item.titulo}-note`} className="movement-item">
                  <strong>{item.data}</strong>
                  <span>{item.titulo} registrado por {item.autor}.</span>
                </div>
              ))}
            </div>
          </article>
        ) : null}

        {currentTab === "resumo" ? (
          <>
            <article className="panel-card">
              <div className="panel-header"><h3><FileText size={18} strokeWidth={2} /> Resumo do acolhido</h3></div>
              <div className="summary-grid">
                <div><span>Nome completo:</span><strong>{resident.nome}</strong></div>
                <div><span>Data de nascimento:</span><strong>{formatDate(resident.dataNascimento)}</strong></div>
                <div><span>Idade:</span><strong>{resident.idade} anos</strong></div>
                <div><span>CPF:</span><strong>{resident.cpf}</strong></div>
                <div><span>Genero:</span><strong>{resident.genero}</strong></div>
                <div><span>Nacionalidade:</span><strong>{resident.nacionalidade}</strong></div>
                <div><span>Etnia/Cor:</span><strong>{resident.etnia}</strong></div>
                <div><span>Responsavel legal:</span><strong>{resident.responsavelLegal}</strong></div>
                <div><span>Telefone:</span><strong>{resident.telefone}</strong></div>
                <div><span>Vinculo:</span><strong>{resident.vinculo}</strong></div>
                <div><span>Responsavel pelo cadastro:</span><strong>{resident.responsavelCadastro}</strong></div>
                <div><span>Motivo do acolhimento:</span><strong>{resident.motivoAcolhimento}</strong></div>
              </div>
              <div className="summary-observation">
                <span>Observacoes gerais:</span>
                <p>{resident.observacoesGerais}</p>
              </div>
            </article>

            <article className="panel-card">
              <div className="panel-header"><h3><CalendarDays size={18} strokeWidth={2} /> Linha do tempo</h3></div>
              <div className="timeline-list">
                {medicalTimeline.map((item) => (
                  <div key={`${item.data}-${item.hora}-${item.titulo}`} className="timeline-item">
                    <div className="timeline-date">
                      <strong>{item.data}</strong>
                      <span>{item.hora}</span>
                    </div>
                    <div className="timeline-dot" />
                    <div className="timeline-content">
                      <strong>{item.titulo}</strong>
                      <span>{item.autor}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="panel-footer-link" onClick={() => onAction("show-full-timeline")}>Ver linha do tempo completa</button>
            </article>

            <article className="panel-card">
              <div className="panel-header"><h3><Target size={18} strokeWidth={2} /> Situacao atual</h3></div>
              <div className="status-grid">
                <div><span>Condicao de saude:</span><Badge>{resident.condicaoSaude}</Badge></div>
                <div><span>Situacao escolar:</span><Badge>{resident.situacaoEscolar}</Badge></div>
                <div><span>Comportamento:</span><Badge>{resident.comportamento}</Badge></div>
                <div><span>Rede de apoio:</span><strong>{resident.redeApoio}</strong></div>
                <div><span>Acompanhamento psicologico:</span><strong>{resident.acompanhamentoPsicologico}</strong></div>
                <div><span>Acompanhamento social:</span><strong>{resident.acompanhamentoSocial}</strong></div>
              </div>
              <div className="status-update">Ultima atualizacao por {currentUser.nome} ({currentUser.perfil}).</div>
            </article>

            <article className="panel-card">
              <div className="panel-header"><h3><AlertTriangle size={18} strokeWidth={2} /> Alertas e observacoes</h3></div>
              <div className="alerts-list">
                {alerts.map((alerta) => (
                  <div key={`${alerta.tipo}-${alerta.data}`} className={`alert-item ${alerta.tipo === "Atencao" ? "warning" : "info"}`}>
                    <div>
                      <strong>{alerta.tipo}</strong>
                      <p>{alerta.texto}</p>
                    </div>
                    <span>{alerta.data}</span>
                  </div>
                ))}
              </div>
              <button type="button" className="panel-footer-link" onClick={() => onAction("show-alerts-panel")}>Ver todos os alertas</button>
            </article>

            <article className="panel-card full-width">
              <div className="panel-header"><h3><Target size={18} strokeWidth={2} /> Plano de acao atual</h3></div>
              <div className="plan-grid">
                <div><span>Objetivo geral:</span><strong>{resident.objetivoPlano}</strong></div>
                <div><span>Responsavel:</span><strong>{resident.responsavelPlano}</strong></div>
                <div><span>Inicio:</span><strong>{formatDate(resident.dataAcolhimento)}</strong></div>
                <div><span>Revisao prevista:</span><strong>{formatDate(resident.revisaoPrevista)}</strong></div>
                <div><span>Status:</span><Badge>{resident.planoStatus}</Badge></div>
              </div>
              <div className="plan-footer">
                <button type="button" className="primary-small-button" onClick={() => onTabChange("plano")}>
                  <Target size={16} strokeWidth={2.1} />
                  <span>Ver plano completo</span>
                </button>
              </div>
            </article>
          </>
        ) : null}
      </section>
    </>
  );
}
