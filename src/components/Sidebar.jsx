import {
  Boxes,
  ClipboardList,
  FileHeart,
  FileText,
  HandHeart,
  LayoutDashboard,
  LogOut,
  ShieldUser,
  Users,
  CalendarRange,
  HeartHandshake,
  ChartColumn
} from "lucide-react";

const iconMap = {
  dashboard: LayoutDashboard,
  acolhidos: Users,
  prontuarios: FileHeart,
  operacoes: CalendarRange,
  estoque: Boxes,
  doacoes: HeartHandshake,
  governance: ChartColumn,
  configuracoes: ShieldUser
};

function SidebarItem({
  id,
  label,
  active,
  expanded,
  collapsed,
  children,
  hasChildren,
  onNavigate,
  onToggle,
  onExpandSidebar
}) {
  const Icon = iconMap[id];

  return (
    <div className="sidebar-group">
      <button
        type="button"
        className={`sidebar-link ${active ? "active" : ""}`}
        onClick={() => {
          if (collapsed && hasChildren) {
            onExpandSidebar();
            return;
          }
          if (hasChildren) {
            onToggle(id);
            return;
          }
          onNavigate(id);
        }}
      >
        <span className="sidebar-link-icon">{Icon ? <Icon size={18} strokeWidth={2} /> : null}</span>
        {!collapsed ? <span>{label}</span> : null}
        {!collapsed && hasChildren ? <span className="sidebar-chevron">{expanded ? "⌃" : "⌄"}</span> : null}
      </button>
      {!collapsed && hasChildren && expanded ? <div className="sidebar-submenu">{children}</div> : null}
    </div>
  );
}

export function Sidebar({
  currentView,
  expandedMenus,
  collapsed,
  onNavigate,
  onToggleMenu,
  onLogout
}) {
  const activeRoot = currentView === "dashboard"
    ? "dashboard"
    : ["triagem", "acolhidos", "cadastro"].includes(currentView)
      ? "acolhidos"
      : currentView === "prontuario"
        ? "prontuarios"
        : currentView === "escalas"
          ? "operacoes"
          : ["estoque", "estoque-categorias", "estoque-movimentacoes", "doadores"].includes(currentView)
            ? "estoque"
            : currentView === "doacoes"
              ? "doacoes"
              : ["auditoria", "relatorios"].includes(currentView)
                ? "governance"
                : "configuracoes";

  const submenu = (items) => items.map((item) => (
    <button
      key={item.view}
      type="button"
      className={`submenu-link ${currentView === item.view ? "active" : ""}`}
      onClick={() => onNavigate(item.view, item.options)}
    >
      {item.icon}
      <span>{item.label}</span>
    </button>
  ));

  return (
    <aside className={`app-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="brand-row">
          {!collapsed ? (
            <div className="brand-copy">
              <img src="/logo-full.svg" alt="Terra da Esperanca" className="brand-logo-full" />
            </div>
          ) : (
            <div className="brand-mark">
              <img src="/logo-mark.svg" alt="Terra da Esperanca" className="brand-logo-mark" />
            </div>
          )}
        </div>
        {!collapsed ? <p className="brand-support">Sistema institucional de acolhimento e acompanhamento.</p> : null}
      </div>

      <nav className="sidebar-nav">
        <SidebarItem
          id="dashboard"
          label="Dashboard"
          active={activeRoot === "dashboard"}
          expanded={false}
          collapsed={collapsed}
          hasChildren={false}
          onNavigate={onNavigate}
          onToggle={onToggleMenu}
          onExpandSidebar={() => onToggleMenu("__expand_sidebar__")}
        />
        <SidebarItem
          id="acolhidos"
          label="Acolhidos"
          active={activeRoot === "acolhidos"}
          expanded={expandedMenus.acolhidos}
          collapsed={collapsed}
          hasChildren
          onNavigate={onNavigate}
          onToggle={onToggleMenu}
          onExpandSidebar={() => onToggleMenu("__expand_sidebar__")}
        >
          {submenu([
            { label: "Triagem", view: "triagem", icon: <ClipboardList size={16} strokeWidth={1.9} /> },
            { label: "Lista de acolhidos", view: "acolhidos", icon: <Users size={16} strokeWidth={1.9} /> },
            { label: "Cadastrar acolhido", view: "cadastro", icon: <FileText size={16} strokeWidth={1.9} /> }
          ])}
        </SidebarItem>
        <SidebarItem
          id="prontuarios"
          label="Prontuarios"
          active={activeRoot === "prontuarios"}
          expanded={false}
          collapsed={collapsed}
          hasChildren={false}
          onNavigate={() => onNavigate("prontuario")}
          onToggle={onToggleMenu}
          onExpandSidebar={() => onToggleMenu("__expand_sidebar__")}
        />
        <SidebarItem
          id="operacoes"
          label="Rotina e escalas"
          active={activeRoot === "operacoes"}
          expanded={expandedMenus.operacoes}
          collapsed={collapsed}
          hasChildren
          onNavigate={onNavigate}
          onToggle={onToggleMenu}
          onExpandSidebar={() => onToggleMenu("__expand_sidebar__")}
        >
          {submenu([{ label: "Escalas", view: "escalas", icon: <CalendarRange size={16} strokeWidth={1.9} /> }])}
        </SidebarItem>
        <SidebarItem
          id="estoque"
          label="Estoque"
          active={activeRoot === "estoque"}
          expanded={expandedMenus.estoque}
          collapsed={collapsed}
          hasChildren
          onNavigate={onNavigate}
          onToggle={onToggleMenu}
          onExpandSidebar={() => onToggleMenu("__expand_sidebar__")}
        >
          {submenu([
            { label: "Itens de estoque", view: "estoque", icon: <Boxes size={16} strokeWidth={1.9} /> },
            { label: "Doadores", view: "doadores", icon: <HandHeart size={16} strokeWidth={1.9} /> },
            { label: "Categorias", view: "estoque-categorias", icon: <ChartColumn size={16} strokeWidth={1.9} /> },
            { label: "Movimentacoes", view: "estoque-movimentacoes", icon: <ClipboardList size={16} strokeWidth={1.9} /> }
          ])}
        </SidebarItem>
        <SidebarItem
          id="doacoes"
          label="Doacoes"
          active={activeRoot === "doacoes"}
          expanded={false}
          collapsed={collapsed}
          hasChildren={false}
          onNavigate={() => onNavigate("doacoes")}
          onToggle={onToggleMenu}
          onExpandSidebar={() => onToggleMenu("__expand_sidebar__")}
        />
        <SidebarItem
          id="governance"
          label="Governanca"
          active={activeRoot === "governance"}
          expanded={expandedMenus.governance}
          collapsed={collapsed}
          hasChildren
          onNavigate={onNavigate}
          onToggle={onToggleMenu}
          onExpandSidebar={() => onToggleMenu("__expand_sidebar__")}
        >
          {submenu([
            { label: "Auditoria", view: "auditoria", icon: <ShieldUser size={16} strokeWidth={1.9} /> },
            { label: "Relatorios", view: "relatorios", icon: <ChartColumn size={16} strokeWidth={1.9} /> }
          ])}
        </SidebarItem>
        <SidebarItem
          id="configuracoes"
          label="Acesso e usuarios"
          active={activeRoot === "configuracoes"}
          expanded={false}
          collapsed={collapsed}
          hasChildren={false}
          onNavigate={() => onNavigate("configuracoes")}
          onToggle={onToggleMenu}
          onExpandSidebar={() => onToggleMenu("__expand_sidebar__")}
        />
      </nav>

      <button type="button" className="logout-button" onClick={onLogout}>
        <LogOut size={18} strokeWidth={2.1} />
        {!collapsed ? <span>Sair do sistema</span> : null}
      </button>
    </aside>
  );
}
