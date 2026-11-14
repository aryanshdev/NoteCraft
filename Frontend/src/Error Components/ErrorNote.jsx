import { Link } from "react-router-dom";

// A crumpled sticky note pinned to the middle of the desk.
export default function ErrorNote({ code, title, children, to, action, color = "yellow", fullScreen = false }) {
  return (
    <div
      className={`${fullScreen ? "min-h-screen" : "h-full"} flex w-full flex-col items-center justify-center gap-10 px-6 py-16 text-center`}
    >
      <div
        className={`note paper-${color} !h-auto w-72 px-6 pb-8 pt-8`}
        style={{ "--tilt": "-3deg", "--tape": "4deg" }}
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-black/50">error</p>
        <p className="font-hand text-8xl font-bold leading-none">{code}</p>
        <p className="mt-2 font-hand text-2xl font-bold">{title}</p>
      </div>
      <p className="max-w-md text-lg text-ink-300">{children}</p>
      <Link to={to} className="btn-primary">
        {action}
      </Link>
    </div>
  );
}
