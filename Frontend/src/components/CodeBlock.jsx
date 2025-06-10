// CodeBlock.jsx
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  darkula,
  gruvboxDark,
  hopscotch,
  paraisoDark,
} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { kimbieDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { nnfxDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { rainbow } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { tomorrowNightBlue } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { tomorrowNight } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { vsDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

function CodeBlock({ children, className }) {
  var urls = {
    "c#": "https://x85pek5qfc.execute-api.ap-south-1.amazonaws.com/default/NoteCraft-CSharp-Runner",
    csharp:
      "https://x85pek5qfc.execute-api.ap-south-1.amazonaws.com/default/NoteCraft-CSharp-Runner",
    cs: "https://x85pek5qfc.execute-api.ap-south-1.amazonaws.com/default/NoteCraft-CSharp-Runner",
    java: "https://g11cpg2862.execute-api.ap-south-1.amazonaws.com/default/NoteCraft-JAVA-Runner",
    js: "https://mukyv6o63b.execute-api.ap-south-1.amazonaws.com/default/NoteCraft-JS-Runner",
    javascript:
      "https://mukyv6o63b.execute-api.ap-south-1.amazonaws.com/default/NoteCraft-JS-Runner",
    py: "https://cc346ke1th.execute-api.ap-south-1.amazonaws.com/default/NoteCraft-Python-Runner",
    python:
      "https://cc346ke1th.execute-api.ap-south-1.amazonaws.com/default/NoteCraft-Python-Runner",
    ruby: "https://w4frr0jp1c.execute-api.ap-south-1.amazonaws.com/default/NoteCraft-Ruby-Runner",
  };

  const [output, setOutput] = useState("");
  const runCode = async () => {
    setOutput("Running...");
    try {
      const response = await fetch(urls[language], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: children }),
      });

      const data = await response.json();
      setOutput(data.output || data.error || "No output");
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const language = className?.replace("language-", "") || "plaintext";
  return (
    <div className="relative text-white rounded-lg overflow-hidden my-2 codeblock">
      <div className="px-4 py-2 bg-gray-900 bg-opacity-75 text-sm mb-0 flex justify-between items-center z-[15]">
        <span>{language.slice(0, 1).toUpperCase() + language.slice(1)}</span>
        <div className="gap-5 flex">
          <button
            onClick={() => navigator.clipboard.writeText(children)}
            className="text-blue-400 hover:text-blue-300"
          >
            Copy
          </button>
          {language in urls && (
            <button
              onClick={() => {
                runCode();
              }}
              className="text-amber-400 hover:text-amber-300"
            >
              Run
            </button>
          )}
        </div>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        wrapLongLines
        customStyle={{
          margin: 0,
          borderRadius: "0 0 10px 10px",
          zIndex: "15",
          position: "relative",
        }}
      >
        {String(children).trim()}
      </SyntaxHighlighter>

      {output && (
        <div className="-mt-3 z-[14] p-2 pt-4  text-green-500 rounded flex flex-col overflow-auto scrollbar-thin bg-gray-800 bg-opacity-50">
          <strong className="text-white font-bold">Output:</strong>

          <pre className="pr-5 mx-2">{output}</pre>
        </div>
      )}
    </div>
  );
}

export default CodeBlock;
