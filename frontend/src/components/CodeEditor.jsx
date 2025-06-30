import React, { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { useRunCodeMutation } from "../redux/api/submissionAPI"; // ✅

const BOILERPLATES = {
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Your code here
    return 0;
}`,
  python: `# Your code here
print("Hello, World!")`,
  javascript: `// Your code here
console.log("Hello, World!");`,
  java: `public class Main {
  public static void main(String[] args) {
    // Your code here
  }
}`,
};

const CodeEditor = () => {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(BOILERPLATES["cpp"]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const [runCode, { isLoading }] = useRunCodeMutation();

  useEffect(() => {
    setCode(BOILERPLATES[language]);
  }, [language]);

  const handleRun = async () => {
    setOutput(`🚀 Running your ${language} code...`);

    try {
      const res = await runCode({ language, code, input }).unwrap(); 

      if (res.success) {
        setOutput(`✅ Output:\n${res.output}`);
      } else {
        setOutput(`❌ Error:\n${res.error}`);
      }
    } catch (err) {
      console.error("Execution failed", err);
      setOutput("❌ Failed to run the code. Please try again.");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6 space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm font-medium text-gray-400">
          Choose Language:
        </label>
        <select
          className="bg-gray-800 text-white px-4 py-2 rounded-md outline-none border border-gray-700"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
        </select>
      </div>

      <div className="relative flex w-full bg-gray-800 rounded-md overflow-hidden shadow-inner border border-gray-700">
        <div className="bg-gray-900 text-gray-500 text-right pr-3 py-3 pl-2 text-sm font-mono select-none">
          {Array.from({ length: code.split("\n").length }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();
              const { selectionStart, selectionEnd } = e.target;
              const newCode =
                code.substring(0, selectionStart) +
                "  " +
                code.substring(selectionEnd);
              setCode(newCode);
              setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd =
                  selectionStart + 2;
              }, 0);
            } else if (e.key === "Enter") {
              e.preventDefault();
              const { selectionStart, selectionEnd } = e.target;
              const lines = code.substring(0, selectionStart).split("\n");
              const currentLine = lines[lines.length - 1];
              const indentation = currentLine.match(/^\s*/)?.[0] || "";
              const newCode =
                code.substring(0, selectionStart) +
                "\n" +
                indentation +
                code.substring(selectionEnd);
              setCode(newCode);
              setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd =
                  selectionStart + 1 + indentation.length;
              }, 0);
            }
          }}
          rows="14"
          className="codearea w-full bg-transparent text-sm text-white p-3 font-mono resize-none focus:outline-none focus:ring-0"
          spellCheck="false"
          style={{ lineHeight: "1.5", minWidth: "0" }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">
          Custom Input (optional):
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows="3"
          className="w-full bg-gray-800 text-white p-2 rounded-md border border-gray-700 focus:outline-none font-mono text-sm resize-none"
          placeholder="Enter input for cin() / input()..."
        />
      </div>

      <div className="text-right">
        <button
          onClick={handleRun}
          disabled={isLoading}
          className={`flex items-center gap-2 px-6 py-2 rounded-md font-semibold text-white transition duration-300 shadow ${
            isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"
          }`}
        >
          <FaPlay size={18} /> {isLoading ? "Running..." : "Run Code"}
        </button>
      </div>

      <div className="bg-gray-800 p-4 rounded-md text-sm text-green-300 whitespace-pre-wrap border border-gray-700">
        <h3 className="font-semibold text-white mb-2">🔽 Output</h3>
        {output || "Your output will appear here..."}
      </div>
    </div>
  );
};

export default CodeEditor;
