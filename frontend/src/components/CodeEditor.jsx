import { useState, useEffect } from "react";
import { FaPlay, FaUndo, FaUpload } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";

import {
  useSubmitCodeMutation,
  useLazyGetSubmissionByIdQuery,
} from "../redux/api/submissionAPI";
import { useRunCodeMutation } from "../redux/api/compilerAPI";

import useCode from "../hooks/useCode";

const LANGUAGES = ["cpp", "python", "javascript", "java"];

const CodeEditor = ({ problemId: propId }) => {
  const { id: routeId } = useParams();
  const problemId = propId || routeId;

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  const [submitCode, { isLoading: submitting }] = useSubmitCodeMutation();
  const [runCode, { isLoading: running }] = useRunCodeMutation();
  const [fetchSubmission] = useLazyGetSubmissionByIdQuery();

  const { code, language, updateCode, updateLanguage } = useCode();

  useEffect(() => {
    // Load initial boilerplate if empty
    if (!code) loadBoilerplate(language, updateCode);
  }, []);

  useEffect(() => {
    if (!submissionId || !isPolling) return;
    const interval = pollSubmission(
      submissionId,
      fetchSubmission,
      setVerdict,
      setOutput,
      setIsPolling
    );
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

  const handleReset = () => {
    loadBoilerplate(language, updateCode);
    setOutput("");
    setVerdict(null);
    toast.success("Code Reset");
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6 space-y-5">
      <LanguageSelector
        language={language}
        setLanguage={(lang) => {
          updateLanguage(lang);
          loadBoilerplate(lang, updateCode);
          setOutput("");
          setVerdict(null);
          toast.success("Code Reset");
        }}
      />

      <MonacoEditor code={code} setCode={updateCode} language={language} />

      <CustomInput input={input} setInput={setInput} />

      <ActionButtons
        handleRun={handleRun}
        handleSubmit={handleSubmit}
        handleReset={handleReset}
        running={running}
        submitting={submitting}
      />

      <OutputBox output={output} verdict={verdict} />
    </div>
  );
};

export default CodeEditor;

const LanguageSelector = ({ language, setLanguage }) => (
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
);

const MonacoEditor = ({ code, setCode, language }) => (
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
);

const CustomInput = ({ input, setInput }) => (
  <textarea
    rows="3"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    className="w-full bg-gray-800 p-2 rounded-md border border-gray-700 text-sm font-mono"
    placeholder="Enter custom input..."
  />
);

const ActionButtons = ({ handleRun, handleSubmit, handleReset, running, submitting }) => (
  <div className="flex justify-end gap-4">
    <ActionButton
      onClick={handleReset}
      loading={false}
      label="Reset"
      icon={<FaUndo/>}
      color="gray"
    />
    <ActionButton
      onClick={handleRun}
      loading={running}
      label="Run"
      icon={<FaPlay size={16} />}
      color="green"
    />
    <ActionButton
      onClick={handleSubmit}
      loading={submitting}
      label="Submit"
      icon={<FaUpload size={16} />}
      color="blue"
    />
  </div>
);

const ActionButton = ({ onClick, loading, label, icon, color }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium text-white shadow transition cursor-pointer ${
      loading
        ? "bg-gray-500 cursor-not-allowed"
        : `bg-${color}-600 hover:bg-${color}-500`
    }`}
  >
    {icon}
    {loading ? `${label}...` : label}
  </button>
);

const OutputBox = ({ output, verdict }) => {
  const getVerdictColor = () => {
    if (verdict === "success" || verdict?.toLowerCase() === "accepted") return "text-green-400";
    if (verdict?.toLowerCase() === "pending") return "text-yellow-400";
    return "text-red-400";
  };

  const verdictClass =
    verdict === "success" || verdict?.toLowerCase() === "accepted"
      ? "border-green-500/50 bg-gradient-to-br from-green-900/20 via-gray-800 to-gray-900"
      : verdict?.toLowerCase() === "pending"
      ? "border-yellow-500/50 bg-gradient-to-br from-yellow-900/20 via-gray-800 to-gray-900"
      : verdict
      ? "border-red-500/50 bg-gradient-to-br from-red-900/20 via-gray-800 to-gray-900"
      : "border-gray-700 bg-gray-800";

  return (
    <div
      className={`relative rounded-xl shadow-lg border-2 p-5 overflow-auto transition-all duration-300 ${verdictClass}`}
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
  );
};

// 🔷 Utilities

function loadBoilerplate(language, setCode) {
  fetch("/data.json")
    .then((res) => res.json())
    .then((data) => setCode(data[language] || ""))
    .catch(() => setCode(""));
}

function pollSubmission(
  submissionId,
  fetchSubmission,
  setVerdict,
  setOutput,
  setIsPolling
) {
  const interval = setInterval(async () => {
    try {
      const res = await fetchSubmission(submissionId).unwrap();
      const currentVerdict = res.submission?.verdict;

      if (!currentVerdict) {
        setOutput("⚠️ Verdict not available yet.");
        return;
      }

      setVerdict(currentVerdict);

      if (currentVerdict !== "Pending") {
        const formattedOutput = formatSubmissionOutput(res.submission);
        setOutput(formattedOutput);
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

  return interval;
}

function formatSubmissionOutput(submission) {
  const verdict = submission.verdict;
  if (!verdict) return "⚠️ No verdict available.";

  if (verdict === "Accepted") {
    return `✅ Accepted\n⏱️ Execution Time: ${submission.executionTime} ms\n💾 Memory Used: ${submission.memoryUsed} KB`;
  }

  if (
    ["Wrong Answer", "Time Limit Exceeded", "Memory Limit Exceeded"].includes(verdict)
  ) {
    const failedCases = submission.testCaseResults
      .filter((tc) => tc.status !== "Passed")
      .map(
        (tc) =>
          `❌ Test Case #${tc.testCase}\nInput: ${tc.input}\nExpected: ${tc.expectedOutput}\nActual: ${tc.actualOutput}\nError: ${tc.error || "N/A"}`
      )
      .join("\n\n");

    return `🚨 ${verdict}\n\n${failedCases || "No details available."}`;
  }

  if (["Compilation Error", "Runtime Error"].includes(verdict)) {
    return `💥 ${verdict}\n${submission.error || "No error details available."}`;
  }

  return `ℹ️ Verdict: ${verdict}`;
}
