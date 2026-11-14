import { tiltFor } from "../lib/utils";

// Display-only sticky note for marketing pages (no actions wired up).
export default function PaperNote({ title, body, color = "yellow", tilt, className = "", style = {} }) {
  const vars = tiltFor(title);
  if (tilt !== undefined) vars["--tilt"] = `${tilt}deg`;
  return (
    <div className={`note paper-${color} !h-auto min-h-44 !justify-start px-4 pb-6 pt-5 ${className}`} style={{ ...vars, ...style }}>
      <h3 className="note-title">{title}</h3>
      <p className="note-text">{body}</p>
    </div>
  );
}
