export function Metric({ label, value, change, icon: Icon, tone }) {
  return (
    <div className="metric-card">
      <div className={`metric-icon tone-${tone}`}>
        <Icon size={18} />
      </div>
      <div className="mt-5 flex items-end justify-between gap-2">
        <div>
          <p className="text-3xl font-bold tracking-[-0.04em]">{value}</p>
          <p className="mt-1 text-xs text-[#718080]">{label}</p>
        </div>
        <span className={`metric-change change-${tone}`}>{change}</span>
      </div>
    </div>
  );
}
