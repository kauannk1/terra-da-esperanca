import { AlertTriangle, CalendarDays, ClipboardList, Download, Eye, HandCoins, Package, Plus, Search, TriangleAlert } from "lucide-react";
import { MetricCard } from "../components/MetricCard";
import { formatCurrency, paginateItems } from "../utils/helpers";
import { StatusPill } from "./shared/ViewPrimitives";

export function EstoqueView({
  inventory,
  stockAlerts,
  metrics,
  lastUpdated,
  filters,
  onFilterChange,
  onAction
}) {
  const categoryOptions = ["Todas", ...new Set(inventory.map((item) => item.categoria))];
  const filtered = inventory.filter((item) => {
    const query = filters.search.trim().toLowerCase();
    const matchesSearch = !query || item.item.toLowerCase().includes(query) || item.categoria.toLowerCase().includes(query);
    const matchesCategory = filters.category === "Todas" || item.categoria === filters.category;
    const matchesStatus = filters.status === "Todos" || item.status === filters.status;
    const matchesStock = filters.estoque === "Todos" || item.status === filters.estoque || (filters.estoque === "Baixo" && item.status === "Critico");
    return matchesSearch && matchesCategory && matchesStatus && matchesStock;
  });
  const pageData = paginateItems(filtered, filters.page);
  const [lastDate, lastTime] = String(lastUpdated).split(" ");

  return (
    <>
      <section className="stock-metric-grid">
        <MetricCard title="Total de itens" value={metrics.totalUnits} sub={`${metrics.totalItems} cadastros ativos`} icon={<Package size={24} strokeWidth={2} />} tone="purple" foot="Controle consolidado" />
        <MetricCard title="Valor total em estoque" value={formatCurrency(metrics.totalValue)} sub="valor estimado" icon={<HandCoins size={24} strokeWidth={2} />} tone="green" foot="Atualizado automaticamente" />
        <MetricCard title="Estoque baixo" value={metrics.low} sub="itens que requerem atencao" icon={<TriangleAlert size={24} strokeWidth={2} />} tone="amber" foot="Monitoramento ativo" />
        <MetricCard title="Itens criticos" value={metrics.critical} sub="reposicao prioritaria" icon={<AlertTriangle size={24} strokeWidth={2} />} tone="red" foot="Acompanhamento diario" />
        <MetricCard title="Ultima atualizacao" value={lastDate || "-"} sub={lastTime ? `as ${lastTime}` : "sem horario"} icon={<CalendarDays size={24} strokeWidth={2} />} tone="blue" foot="Dados recentes" />
      </section>

      <section className="estoque-layout">
        <article className="panel-card estoque-main-card">
          <div className="panel-header">
            <div>
              <h3>Itens de estoque</h3>
              <p>Visualize e gerencie todos os itens do estoque da instituicao.</p>
            </div>
            <div className="header-action-group">
              <button type="button" className="outline-button" onClick={() => onAction("export-stock-report")}>
                <Download size={16} strokeWidth={2.1} />
                <span>Exportar relatorio</span>
              </button>
              <button type="button" className="primary-small-button" onClick={() => onAction("new-item")}>
                <Plus size={16} strokeWidth={2.1} />
                <span>Novo item</span>
              </button>
            </div>
          </div>

          <div className="filters-row">
            <div className="search-field">
              <Search size={17} strokeWidth={2.1} />
              <input value={filters.search} onChange={(event) => onFilterChange("search", event.target.value)} placeholder="Buscar item..." />
            </div>
            <select value={filters.category} onChange={(event) => onFilterChange("category", event.target.value)}>
              {categoryOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
            <select value={filters.status} onChange={(event) => onFilterChange("status", event.target.value)}>
              {["Todos", "Adequado", "Baixo", "Critico"].map((option) => <option key={option}>{option}</option>)}
            </select>
            <select value={filters.estoque} onChange={(event) => onFilterChange("estoque", event.target.value)}>
              {["Todos", "Baixo", "Critico"].map((option) => <option key={option}>{option}</option>)}
            </select>
            <button type="button" className="ghost-filter-button" onClick={() => onAction("clear-stock-filters")}>
              <TriangleAlert size={16} strokeWidth={2.1} />
              <span>Limpar filtros</span>
            </button>
          </div>

          <div className="table-scroll">
            <table className="data-table stock-table">
              <thead>
                <tr>
                  <th>Imagem</th>
                  <th>Item</th>
                  <th>Categoria</th>
                  <th>Estoque atual</th>
                  <th>Unidade</th>
                  <th>Estoque minimo</th>
                  <th>Status</th>
                  <th>Valor unitario</th>
                  <th>Acoes</th>
                </tr>
              </thead>
              <tbody>
                {pageData.items.length ? pageData.items.map((item) => (
                  <tr key={item.id}>
                    <td><div className="product-thumb">{item.imagem}</div></td>
                    <td>{item.item}</td>
                    <td>{item.categoria}</td>
                    <td>{item.estoqueAtual}</td>
                    <td>{item.unidade}</td>
                    <td>{item.estoqueMinimo}</td>
                    <td><StatusPill status={item.status} /></td>
                    <td>{item.valor}</td>
                    <td>
                      <div className="table-actions">
                        <button type="button" onClick={() => onAction("view-stock-item", item.id)} aria-label={`Ver ${item.item}`}>
                          <Eye size={16} strokeWidth={2.1} />
                        </button>
                        <button type="button" onClick={() => onAction("adjust-stock-item", item.id)} aria-label={`Ajustar ${item.item}`}>
                          <Package size={16} strokeWidth={2.1} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="9" className="empty-table">Nenhum item encontrado para os filtros atuais.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="stock-pagination">
            <span>Mostrando {pageData.start} a {pageData.end} de {pageData.totalItems} itens</span>
            <div className="pagination-controls">
              <button type="button" onClick={() => onFilterChange("page", Math.max(1, pageData.page - 1))}>‹</button>
              {Array.from({ length: pageData.totalPages }, (_, index) => index + 1).map((page) => (
                <button key={page} type="button" className={page === pageData.page ? "active" : ""} onClick={() => onFilterChange("page", page)}>
                  {page}
                </button>
              ))}
              <button type="button" onClick={() => onFilterChange("page", Math.min(pageData.totalPages, pageData.page + 1))}>›</button>
            </div>
          </div>
        </article>

        <aside className="stock-side-column">
          <article className="panel-card compact-card">
            <div className="panel-header"><h3><TriangleAlert size={18} strokeWidth={2.1} /> Alertas de estoque</h3></div>
            <div className="compact-list">
              {stockAlerts.map((alerta) => (
                <div key={`${alerta.item}-${alerta.descricao}`} className="compact-item">
                  <div>
                    <strong>{alerta.item}</strong>
                    <span>{alerta.descricao}</span>
                  </div>
                  <span className="compact-arrow">›</span>
                </div>
              ))}
            </div>
            <button type="button" className="panel-footer-link" onClick={() => onAction("go-estoque")}>Ver todos os alertas</button>
          </article>

          <article className="panel-card compact-card">
            <div className="panel-header"><h3><ClipboardList size={18} strokeWidth={2.1} /> Movimentacoes recentes</h3></div>
            <div className="compact-list">
              {inventory.slice(0, 3).map((item) => (
                <div key={`${item.id}-movement`} className="movement-item">
                  <strong>{item.status === "Adequado" ? "Monitoramento" : "Ajuste necessario"}</strong>
                  <span>{item.item}</span>
                  <small>{item.status} • {item.estoqueAtual} {item.unidade}</small>
                  <b>{item.valor}</b>
                </div>
              ))}
            </div>
            <button type="button" className="panel-footer-link" onClick={() => onAction("go-stock-movements")}>Ver todas as movimentacoes</button>
          </article>
        </aside>
      </section>
    </>
  );
}

export function EstoqueCategoriasView({ inventory }) {
  const grouped = Object.entries(inventory.reduce((accumulator, item) => {
    accumulator[item.categoria] = accumulator[item.categoria] || [];
    accumulator[item.categoria].push(item);
    return accumulator;
  }, {}));

  return (
    <section className="panel-card wide-card">
      <div className="panel-header"><h3>Categorias de insumos</h3></div>
      <table className="data-table">
        <thead><tr><th>Categoria</th><th>Quantidade de itens</th><th>Situacao</th></tr></thead>
        <tbody>
          {grouped.map(([categoria, items]) => {
            const situacao = items.some((item) => item.status === "Critico")
              ? "Critico"
              : items.some((item) => item.status === "Baixo")
                ? "Atencao"
                : "Monitorado";
            return (
              <tr key={categoria}>
                <td>{categoria}</td>
                <td>{items.length}</td>
                <td><StatusPill status={situacao} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export function EstoqueMovimentacoesView({ movements }) {
  return (
    <section className="panel-card wide-card">
      <div className="panel-header"><h3>Movimentacoes registradas</h3></div>
      <table className="data-table">
        <thead><tr><th>Tipo</th><th>Item</th><th>Detalhe</th><th>Quantidade</th></tr></thead>
        <tbody>
          {movements.map((mov) => (
            <tr key={`${mov.tipo}-${mov.item}-${mov.detalhe}`}>
              <td>{mov.tipo}</td>
              <td>{mov.item}</td>
              <td>{mov.detalhe}</td>
              <td>{mov.quantidade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
