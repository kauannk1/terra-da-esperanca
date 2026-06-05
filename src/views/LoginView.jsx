import { ArrowRight, Eye, LockKeyhole, ShieldAlert, UserRound, Users } from "lucide-react";

export function LoginView({ onLogin, onOpenModal }) {
  return (
    <section className="login-screen">
      <div className="login-visual">
        <div className="login-brand-block">
          <img src="/logo-full.svg" alt="Terra da Esperanca" className="login-logo-image" />
          <div className="login-brand-line" />
          <p className="login-description">Acolhimento, cuidado e transformacao de vidas.</p>
          <div className="security-card">
            <div className="security-icon">
              <ShieldAlert size={20} strokeWidth={2} />
            </div>
            <div>
              <strong>Sistema seguro e sigiloso</strong>
              <p>Seus dados e das pessoas acolhidas estao protegidos.</p>
            </div>
          </div>
        </div>
      </div>

      <form className="login-panel" onSubmit={onLogin}>
        <div className="login-panel-icon">
          <LockKeyhole size={24} strokeWidth={2} />
        </div>
        <h2>Acesse sua conta</h2>
        <p className="login-subtitle">Informe suas credenciais para entrar no sistema</p>

        <label className="field-label">E-mail ou CPF</label>
        <div className="input-shell">
          <span className="input-icon"><UserRound size={18} strokeWidth={2} /></span>
          <input type="text" name="email" placeholder="Digite seu e-mail ou CPF" required />
        </div>

        <label className="field-label">Senha</label>
        <div className="input-shell">
          <span className="input-icon"><LockKeyhole size={18} strokeWidth={2} /></span>
          <input type="password" name="senha" placeholder="Digite sua senha" required minLength={4} />
          <span className="input-icon right"><Eye size={18} strokeWidth={2} /></span>
        </div>

        <div className="login-links">
          <span />
          <button type="button" className="link-button" onClick={() => onOpenModal("forgot-password")}>Esqueci minha senha</button>
        </div>

        <button type="submit" className="primary-login-button">
          <ArrowRight size={18} strokeWidth={2.2} />
          <span>Entrar</span>
        </button>

        <div className="divider"><span>ou</span></div>

        <button type="button" className="secondary-login-button" onClick={() => onOpenModal("help-admin")}>
          <Users size={18} strokeWidth={2.1} />
          <span>Precisa de ajuda? Fale com a administracao</span>
        </button>

        <p className="login-footnote">
          <ShieldAlert size={15} strokeWidth={2} />
          <span>Ao acessar o sistema, voce concorda com nossa Politica de Privacidade e Termos de Uso.</span>
        </p>
        <p className="login-demo">
          Acesso tecnico: <strong>tecnico@terra.org</strong> / <strong>1234</strong>
          <br />
          Acesso administrativo: <strong>admin@terra.org</strong> / <strong>1234</strong>
        </p>
      </form>
    </section>
  );
}
