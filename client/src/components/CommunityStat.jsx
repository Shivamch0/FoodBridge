export function CommunityStat({ icon: Icon, number, label, text }) {
  return (
    <div className="panel">
      <div className="community-icon">
        <Icon size={19} />
      </div>
      <p className="mt-5 text-4xl font-bold tracking-[-0.05em]">{number}</p>
      <p className="mt-1 font-bold">{label}</p>
      <p className="mt-3 text-sm leading-5 text-[#718080]">{text}</p>
    </div>
  );
}
