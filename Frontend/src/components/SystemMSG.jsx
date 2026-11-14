function SystemMSG({ msg }) {
  return (
    <div className="flex items-center gap-3 text-xs text-ink-400">
      <span className="h-px flex-1 bg-ink-700"></span>
      <span className="font-mono uppercase tracking-[0.12em]">{msg}</span>
      <span className="h-px flex-1 bg-ink-700"></span>
    </div>
  );
}

export default SystemMSG;
