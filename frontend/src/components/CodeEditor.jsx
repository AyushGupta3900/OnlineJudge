import React, { useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";

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
}`
};

const CodeEditor = () => {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(BOILERPLATES["cpp"]);
  const [output, setOutput] = useState("");

  useEffect(() => {
    setCode(BOILERPLATES[language]);
  }, [language]);

  const handleRun = () => {
    setOutput("🚀 Running your " + language + " code...\n✅ Output:\nHello, World!");
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6 space-y-6">
      {/* <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        Code Editor
      </h2> */}

      {/* Language Selector */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm font-medium text-gray-400">Choose Language:</label>
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

      {/* Code Editor with Line Numbers */}
      <div className="relative flex w-full bg-gray-800 rounded-md overflow-hidden shadow-inner border border-gray-700">
        {/* Line Numbers */}
        <div className="bg-gray-900 text-gray-500 text-right pr-3 py-3 pl-2 text-sm font-mono select-none">
          {Array.from({ length: code.split("\n").length }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows="14"
          className="w-full bg-transparent text-sm text-white p-3 font-mono resize-none focus:outline-none focus:ring-0"
          spellCheck="false"
          style={{ lineHeight: "1.5", minWidth: "0" }}
        />
      </div>

      {/* Run Button */}
      <div className="text-right">
        <button
          onClick={handleRun}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-6 py-2 rounded-md font-semibold text-white transition duration-300 shadow"
        >
          <FaPlay size={18} /> Run Code
        </button>
      </div>

      {/* Output */}
      <div className="bg-gray-800 p-4 rounded-md text-sm text-green-300 whitespace-pre-wrap border border-gray-700">
        <h3 className="font-semibold text-white mb-2">🔽 Output</h3>
        {output || "Your output will appear here..."}
      </div>
    </div>
  );
};

export default CodeEditor;
