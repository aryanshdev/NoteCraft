// CodeBlock.jsx
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
        <span>{language}</span>
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
        style={materialDark}
        wrapLongLines
        customStyle={{ margin: 0, borderRadius: "0 0 10px 10px" }}
      >
        {String(children).trim()}
      </SyntaxHighlighter>
    

      {output && (
        <div className="-mt-2 p-2 bg-black bg-opacity-40 text-green-400 rounded">
          <strong>Output:</strong>
          <pre>{output}</pre>
        </div>
        
      )}
    </div>
  );
}

export default CodeBlock;

