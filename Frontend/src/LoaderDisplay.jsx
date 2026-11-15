// Generic loader. Pass `label` to say what is actually happening.
function LoaderDisplay({ label = "Loading…" }) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-4 z-10"
      role="status"
      aria-live="polite"
    >
      <div className="relative h-16 w-14" aria-hidden="true">
        <div className="absolute inset-0 rotate-[-6deg] rounded-sm bg-[#a2cdec] animate-pulse"></div>
        <div className="absolute inset-0 rotate-[4deg] rounded-sm bg-[#f6d860] shadow-lg animate-bounce"></div>
      </div>
      <p className="eyebrow">{label}</p>
    </div>
  );
}

export default LoaderDisplay;
