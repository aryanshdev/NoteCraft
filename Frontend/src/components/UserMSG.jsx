function UserMSG({ msg, name = "User", sending = false }) {
  const text = String(msg);
  const mentionsAI = text.startsWith("@NC-AI");

  return (
    <div className={`flex w-full flex-col gap-1.5 ${sending ? "items-end pl-10" : "items-start pr-10"}`}>
      <span className="text-xs font-semibold text-ink-400">{sending ? "You" : name}</span>
      <div
        className={`AICHAT max-w-full break-words px-4 py-2.5 text-left text-[15px] ${
          sending
            ? "rounded-lg rounded-tr-sm bg-ink-100 text-ink-950"
            : "rounded-lg rounded-tl-sm border border-ink-700 bg-ink-800 text-ink-100"
        }`}
      >
        {mentionsAI ? (
          <>
            <span className="mr-1 rounded bg-marker px-1 py-px font-mono text-xs font-medium text-ink-950">
              @NC-AI
            </span>
            {text.slice(6)}
          </>
        ) : (
          msg
        )}
      </div>
    </div>
  );
}

export default UserMSG;
