import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock"; // Import the custom component

function AIMSG({ msg }) {
  function preprocessMarkdown(markdown) {
  return markdown.replace(/(`{1,3})([^`]+?)\1/g, (match, backticks, content) => {
    const isBlock = backticks.length === 3;
    const tag = isBlock ? 'blockcode' : 'inlinecode';
    return `<${tag}>${content}</${tag}>`;
  });
}

  return (
    <div className="flex w-full flex-col gap-1.5 pr-6">
      <div className="flex flex-row items-center gap-2 text-xs">
        <span className="grid h-5 w-5 place-items-center rounded bg-marker font-mono text-[10px] font-bold text-ink-950">
          @
        </span>
        <span className="font-semibold text-ink-100">NC-AI</span>
        <span className="eyebrow !text-[10px]">assistant</span>
      </div>
      <div className="AICHAT break-words rounded-lg rounded-tl-sm border-l-2 border-marker bg-ink-900 px-4 py-3 text-left text-[15px] text-ink-100">
        <ReactMarkdown
          className="w-full break-words"
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              
              const hasLang = className && className.startsWith("language-");
              
              if (!inline && hasLang) {
                // It's a proper code block
                return <CodeBlock className={className}>{children}</CodeBlock>;
              } else {
               
                return (
                  <code className="rounded bg-black/40 px-1.5 font-mono text-[0.9em]">{children}</code>
                );
              }
            },
          }}
        >
          {msg}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default AIMSG;
