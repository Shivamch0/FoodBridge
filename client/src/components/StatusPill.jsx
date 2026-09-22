export function StatusPill({ label, tone }) {
  return (
    <span className={`status-pill status-${tone}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
