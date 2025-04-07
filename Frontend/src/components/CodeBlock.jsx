// CodeBlock.jsx
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darkula, gruvboxDark, hopscotch, paraisoDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { atomOneDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { a11yDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { kimbieDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { nnfxDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { rainbow } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { tomorrowNightBlue } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { tomorrowNight } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { vsDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { atelierEstuaryDark, atelierSulphurpoolDark, dark, magula, monokaiSublime, nightOwl, shadesOfPurple, solarizedDark, tomorrow } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { atomDark, coldarkCold, coldarkDark, duotoneDark, duotoneEarth, duotoneSpace, holiTheme, lucario, materialDark, materialOceanic, oneDark, solarizedDarkAtom, synthwave84, twilight, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function CodeBlock({ children, className }) {
    const [output, setOutput] = useState("");
    const runCode = async () => {
      
        setOutput("Running...");
        try {
          const response = await fetch("https://4i7e9lhv2a.execute-api.ap-south-1.amazonaws.com/default/TEMP_TESTING", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: children }),
          });
    
          const data = await response.json();
          console.log(data)
          setOutput(data.output || data.error || "No output");
        } catch (error) {
          console.log(error)
          setOutput(`Error: ${error.message}`);
        }
      };
    
  const language = className?.replace("language-", "") || "plaintext";

  return (
    <div className="relative text-white rounded-lg overflow-hidden my-2 codeblock">
      <div className="px-4 py-2 bg-gray-900 text-sm mb-0 flex justify-between items-center">
        <span>{language.slice(0,1).toUpperCase()+language.slice(1)}</span>
       <div className="gap-5 flex">
       <button
          onClick={() => navigator.clipboard.writeText(children)}
          className="text-blue-400 hover:text-blue-300"
        >
          Copy
        </button>
        <button
          onClick={() => {runCode()}}
          className="text-blue-400 hover:text-blue-300"
        >
          Run
        </button>
       </div>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        wrapLongLines
        customStyle={{ margin: 0, borderRadius: "0 0 10px 10px" }}
      >
        {String(children).trim() + "\n"+language}
      </SyntaxHighlighter>
    

      {output && (
        <div className="-mt-2 p-2  text-green-500 rounded flex flex-col overflow-auto">
          <strong className="text-white font-bold">Output:</strong>
          
          <pre className="pr-5 mx-2">{output}</pre>
        </div>
        
      )}
    </div>
  );
}

export default CodeBlock;

