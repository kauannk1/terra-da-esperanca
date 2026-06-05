export function Toast({ toast }) {
  if (!toast) return null;
  return <div className={`toast toast-${toast.tone || "info"}`}>{toast.message}</div>;
}
