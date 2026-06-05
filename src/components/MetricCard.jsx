export function MetricCard({ title, value, sub, icon, tone, foot, positive, bar }) {
  return (
    <article className="metric-card">
      <div className="metric-card-top">
        <div>
          <p className="metric-title">{title}</p>
          <strong>{value}</strong>
          <span className="metric-sub">{sub}</span>
        </div>
        <div className={`metric-icon ${tone}`}>{icon}</div>
      </div>
      {bar ? (
        <>
          <div className="metric-bar">
            <span style={{ width: bar }} />
          </div>
          <p className="metric-foot">{foot}</p>
        </>
      ) : (
        <p className={`metric-foot ${positive ? "positive" : ""}`}>{foot}</p>
      )}
    </article>
  );
}
