import { Link } from "react-router-dom";

const services = [
  { name: "Sharing", state: "up" },
  { name: "Login & auth", state: "up" },
  { name: "Notes & groups", detail: "Creating, managing, updating, deleting", state: "up" },
  { name: "AI chat", state: "up" },
  { name: "Code runners", state: "partial" },
];

const states = {
  up: { label: "Operational", dot: "bg-[#b0d99e]", text: "text-[#b0d99e]" },
  partial: { label: "Partially down", dot: "bg-marker", text: "text-marker" },
  down: { label: "Down", dot: "bg-[#f19a8f]", text: "text-[#f19a8f]" },
};

export default function StatusPage() {
  const allUp = services.every((s) => s.state === "up");
  return (
    <div className="min-h-screen px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="mb-10 inline-flex items-center gap-2 font-semibold">
          <img src="/notecraft-icon-transparent.png" alt="" className="h-8 w-8" />
          NoteCraft
        </Link>
        <p className="eyebrow mb-2">System status</p>
        <h1 className="page-title mb-2">
          {allUp ? "Everything's running." : "Mostly running — one hiccup."}
        </h1>
        <p className="mb-8 text-ink-300">Live state of the services behind NoteCraft.</p>

        <ul className="panel divide-y divide-ink-700 overflow-hidden">
          {services.map((s) => {
            const st = states[s.state];
            return (
              <li key={s.name} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-medium text-ink-100">{s.name}</p>
                  {s.detail ? <p className="text-sm text-ink-400">{s.detail}</p> : null}
                </div>
                <span className={`flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-wider ${st.text}`}>
                  <span className={`h-2.5 w-2.5 rounded-full ${st.dot}`}></span>
                  {st.label}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex flex-wrap gap-5">
          {Object.values(states).map((st) => (
            <span key={st.label} className="flex items-center gap-2 text-sm text-ink-400">
              <span className={`h-2 w-2 rounded-full ${st.dot}`}></span>
              {st.label}
            </span>
          ))}
        </div>

        <Link to="/dashboard" className="btn-paper mt-12">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
