import { CheckCircle2, FileText, Info, MapPinned, UserRound } from "lucide-react";
import { formatCep, formatCpf, formatPhone } from "../utils/helpers";

export function CadastroView({ currentUser, onSubmit, onLookupCep }) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const success = await onSubmit(new FormData(form));
    if (success !== false) {
      form.reset();
    }
  };

  return (
    <div className="cadastro-layout">
      <section className="panel-card cadastro-main">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-section-title"><UserRound size={18} strokeWidth={2} /> <span>1. Dados pessoais</span></div>
            <div className="reference-form-grid cols-3">
              <label><span>Nome completo *</span><input type="text" name="nome" placeholder="Digite o nome completo" required /></label>
              <label><span>Nome social</span><input type="text" name="nomeSocial" placeholder="Digite o nome social (opcional)" /></label>
              <label><span>Data de nascimento *</span><input type="date" name="dataNascimento" required /></label>
              <label>
                <span>CPF *</span>
                <input
                  type="text"
                  name="cpf"
                  placeholder="000.000.000-00"
                  required
                  onInput={(event) => {
                    event.currentTarget.value = formatCpf(event.currentTarget.value);
                  }}
                />
              </label>
              <label><span>RG (ou outro documento)</span><input type="text" name="documento" placeholder="Digite o numero do documento" /></label>
              <label><span>Orgao expedidor</span><input type="text" name="orgao" placeholder="Digite o orgao expedidor" /></label>
              <label>
                <span>Genero *</span>
                <select name="genero" required>
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </label>
              <label><span>Nacionalidade *</span><input type="text" name="nacionalidade" defaultValue="Brasileira" required /></label>
              <label>
                <span>Etnia/Cor</span>
                <select name="etnia" defaultValue="">
                  <option value="">Selecione</option>
                  <option value="Parda">Parda</option>
                  <option value="Branca">Branca</option>
                  <option value="Preta">Preta</option>
                  <option value="Indigena">Indigena</option>
                </select>
              </label>
              <label>
                <span>Telefone (opcional)</span>
                <input
                  type="text"
                  name="telefone"
                  placeholder="(16) 99999-9999"
                  onInput={(event) => {
                    event.currentTarget.value = formatPhone(event.currentTarget.value);
                  }}
                />
              </label>
              <label><span>E-mail (opcional)</span><input type="email" name="email" placeholder="email@exemplo.com" /></label>
              <label><span>Naturalidade</span><input type="text" name="naturalidade" placeholder="Digite a naturalidade" /></label>
              <label>
                <span>Estado civil</span>
                <select name="estadoCivil" defaultValue="">
                  <option value="">Selecione (opcional)</option>
                  <option value="Solteiro">Solteiro</option>
                  <option value="Solteira">Solteira</option>
                  <option value="Casado">Casado</option>
                  <option value="Casada">Casada</option>
                  <option value="Outro">Outro</option>
                </select>
              </label>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title"><MapPinned size={18} strokeWidth={2} /> <span>2. Endereco</span></div>
            <div className="reference-form-grid cols-4">
              <label>
                <span>CEP</span>
                <input
                  type="text"
                  name="cep"
                  placeholder="00000-000"
                  onInput={(event) => {
                    event.currentTarget.value = formatCep(event.currentTarget.value);
                    onLookupCep(event);
                  }}
                  onBlur={onLookupCep}
                />
              </label>
              <label className="span-2"><span>Logradouro (Rua, Av., etc.)</span><input type="text" name="logradouro" placeholder="Digite o logradouro" /></label>
              <label><span>Numero</span><input type="text" name="numero" placeholder="Digite o numero" /></label>
              <label><span>Complemento</span><input type="text" name="complemento" placeholder="Digite o complemento" /></label>
              <label><span>Bairro</span><input type="text" name="bairro" placeholder="Digite o bairro" /></label>
              <label><span>Cidade</span><input type="text" name="cidade" placeholder="Digite a cidade" /></label>
              <label>
                <span>Estado</span>
                <select name="estado" defaultValue="">
                  <option value="">Selecione</option>
                  <option value="SP">SP</option>
                  <option value="MG">MG</option>
                  <option value="RJ">RJ</option>
                </select>
              </label>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-title"><Info size={18} strokeWidth={2} /> <span>3. Informacoes do acolhimento</span></div>
            <div className="reference-form-grid cols-4">
              <label><span>Data de acolhimento *</span><input type="date" name="dataAcolhimento" required defaultValue={new Date().toISOString().slice(0, 10)} /></label>
              <label>
                <span>Motivo do acolhimento *</span>
                <select name="motivo" required defaultValue="">
                  <option value="">Selecione o motivo</option>
                  <option value="Vulnerabilidade social">Vulnerabilidade social</option>
                  <option value="Pos-tratamento">Pos-tratamento</option>
                  <option value="Encaminhamento institucional">Encaminhamento institucional</option>
                </select>
              </label>
              <label>
                <span>Origem do encaminhamento *</span>
                <select name="origem" required defaultValue="">
                  <option value="">Selecione a origem</option>
                  <option value="Conselho Tutelar">Conselho Tutelar</option>
                  <option value="Clinica parceira">Clinica parceira</option>
                  <option value="Encaminhamento familiar">Encaminhamento familiar</option>
                  <option value="Assistencia social">Assistencia social</option>
                  <option value="Procura espontanea">Procura espontanea</option>
                </select>
              </label>
              <label>
                <span>Responsavel pelo cadastro</span>
                <input type="text" value={currentUser.nome} readOnly className="readonly-input" />
              </label>
            </div>
            <input type="hidden" name="responsavel" value={currentUser.nome} />
            <label className="full-label"><span>Observacoes (opcional)</span><textarea name="observacoes" rows="4" placeholder="Digite observacoes adicionais sobre o acolhido..." /></label>
          </div>

          <div className="form-actions-row">
            <button type="reset" className="ghost-form-button">Cancelar</button>
            <button type="submit" className="save-button">
              <FileText size={16} strokeWidth={2.1} />
              <span>Salvar acolhido</span>
            </button>
          </div>
        </form>
      </section>

      <aside className="cadastro-aside">
        <article className="info-box">
          <h4><Info size={18} strokeWidth={2} /> Informacoes importantes</h4>
          <p>Preencha corretamente os campos obrigatorios para registrar a admissao inicial do acolhido.</p>
        </article>
        <article className="info-box">
          <h4><CheckCircle2 size={18} strokeWidth={2} /> Situacao documental</h4>
          <ul className="check-list">
            <li>O sistema registra os documentos como pendentes no cadastro inicial.</li>
            <li>O envio de arquivos pode ser feito em uma etapa posterior da rotina administrativa.</li>
            <li>O prontuario continua exibindo a situacao de cada documento necessario.</li>
          </ul>
        </article>
      </aside>
    </div>
  );
}
