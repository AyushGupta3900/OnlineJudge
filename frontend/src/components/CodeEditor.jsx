import { useState, useEffect } from "react";
import { FaPlay, FaUpload } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  useSubmitCodeMutation,
  useLazyGetSubmissionByIdQuery,
} from "../redux/api/submissionAPI";
import { useRunCodeMutation } from "../redux/api/compilerAPI.js";

const LANGUAGES = ["cpp", "python", "javascript", "java"];

const CodeEditor = ({ problemId: propId }) => {
  const { id: routeId } = useParams();
  const problemId = propId || routeId;

  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  const [submitCode, { isLoading: submitting }] = useSubmitCodeMutation();
  const [runCode, { isLoading: running }] = useRunCodeMutation();
  const [fetchSubmission] = useLazyGetSubmissionByIdQuery();

  // Fetch boilerplate
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/data.json");
        const data = await res.json();
        setCode(data[language] || "");
      } catch {
        setCode("");
      }
    })();
  }, [language]);

  // Polling logic
  useEffect(() => {
    if (!submissionId || !isPolling) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetchSubmission(submissionId).unwrap();
        console.log("Polling response:", res);

        const currentVerdict = res.submission?.verdict;
        if (!currentVerdict) {
          setOutput("⚠️ Verdict not available yet.");
          return;
        }

        setVerdict(currentVerdict);
        if (currentVerdict !== "Pending") {
          setOutput(`✅ Verdict: ${currentVerdict}`);
          clearInterval(interval);
          setIsPolling(false);
        }
      } catch (error) {
        console.error("Polling error:", error);
        setOutput("❌ Failed to fetch verdict.");
        clearInterval(interval);
        setIsPolling(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [submissionId, isPolling]);

  const handleRun = async () => {
    setOutput(`🟡 Running ${language} code...`);
    setVerdict(null);
    try {
      const res = await runCode({ language, code, input }).unwrap();
      setOutput(res.success ? res.output : res.error);
      setVerdict(res.success ? "success" : "error");
    } catch {
      setOutput("❌ Failed to run the code.");
      setVerdict("error");
    }
  };

  const handleSubmit = async () => {
    if (!problemId) return setOutput("⚠️ Problem ID not found.");
    setOutput("📤 Submitting code...");
    setVerdict("Pending");
    setIsPolling(true);
    try {
      const res = await submitCode({ problemId, language, code }).unwrap();
      setSubmissionId(res.submission._id);
      setOutput("⏳ Waiting for verdict...");
    } catch {
      setOutput("❌ Submission failed.");
      setVerdict("error");
      setIsPolling(false);
    }
  };

  const getVerdictColor = () => {
    if (verdict === "success" || verdict?.toLowerCase() === "accepted") return "text-green-400";
    if (verdict?.toLowerCase() === "pending") return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6 space-y-5">
      {/* Language Selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">Language:</span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-md"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Monaco Editor */}
      <Editor
        height="420px"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(val) => setCode(val)}
        options={{
          fontSize: 15,
          minimap: { enabled: false },
          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 8,
            vertical: "visible",
            horizontal: "visible",
          },
          padding: { top: 12 },
        }}
      />

      {/* Custom Input */}
      <textarea
        rows="3"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full bg-gray-800 p-2 rounded-md border border-gray-700 text-sm font-mono"
        placeholder="Enter custom input..."
      />

      {/* Run & Submit Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleRun}
          disabled={running}
          className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium text-white shadow transition cursor-pointer ${
            running
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500"
          }`}
        >
          <FaPlay size={16} />
          {running ? "Running..." : "Run"}
        </button>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium text-white shadow transition cursor-pointer ${
            submitting
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
        >
          <FaUpload size={16} />
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>

      {/* Output Box */}
      <div
        className={`relative rounded-xl shadow-lg border-2 p-5 overflow-auto transition-all duration-300 ${
          verdict === "success" || verdict?.toLowerCase() === "accepted"
            ? "border-green-500/50 bg-gradient-to-br from-green-900/20 via-gray-800 to-gray-900"
            : verdict?.toLowerCase() === "pending"
            ? "border-yellow-500/50 bg-gradient-to-br from-yellow-900/20 via-gray-800 to-gray-900"
            : verdict
            ? "border-red-500/50 bg-gradient-to-br from-red-900/20 via-gray-800 to-gray-900"
            : "border-gray-700 bg-gray-800"
        }`}
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className={`text-xl font-semibold flex items-center gap-2 ${getVerdictColor()}`}>
            📤 Output
          </h3>
          {verdict && (
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full animate-pulse ${
                verdict === "success" || verdict?.toLowerCase() === "accepted"
                  ? "bg-green-700 text-green-200"
                  : verdict?.toLowerCase() === "pending"
                  ? "bg-yellow-600 text-yellow-100"
                  : "bg-red-700 text-red-200"
              }`}
            >
              {verdict.toUpperCase()}
            </span>
          )}
        </div>

        <pre className="whitespace-pre-wrap text-sm font-mono text-gray-200 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {output || "Your output will appear here..."}
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;