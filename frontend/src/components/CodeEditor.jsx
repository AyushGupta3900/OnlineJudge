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

import { motion } from "framer-motion";
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";

const LANGUAGES = ["cpp", "python", "javascript", "java"];

const CodeEditor = ({ problemId: propId }) => {
  const { id: routeId } = useParams();
  const problemId = propId || routeId;

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  const [submitCode, { isLoading: submitting }] = useSubmitCodeMutation();
  const [runCode, { isLoading: running }] = useRunCodeMutation();
  const [fetchSubmission] = useLazyGetSubmissionByIdQuery();

  const { code, language, updateCode, updateLanguage, reset } = useCode(problemId);

  useEffect(() => {
    if (!code) loadBoilerplate(language, updateCode);
  }, [problemId, language, code, updateCode]);

  useEffect(() => {
    if (!submissionId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetchSubmission(submissionId).unwrap();
        const currentVerdict = res.submission?.verdict;

        if (!currentVerdict) {
          setOutput("⚠️ Verdict not yet available.");
          return;
        }

        setVerdict(currentVerdict);

        if (currentVerdict !== "Pending") {
          const formattedOutput = formatSubmissionOutput(res.submission);
          setOutput(formattedOutput);
          clearInterval(interval);
          setPollingInterval(null);
        }
      } catch (err) {
        console.error("Polling error:", err);
        setOutput("❌ Failed to fetch verdict.");
        clearInterval(interval);
        setPollingInterval(null);
      }
    }, 2000);

    setPollingInterval(interval);

    return () => clearInterval(interval);
  }, [submissionId, fetchSubmission]);

  const handleRun = async () => {
    setOutput(`🟡 Running ${language} code...`);
    setVerdict(null);
    try {
      const res = await runCode({ language, code, input }).unwrap();
      setOutput(
        res.success
          ? `${res.output}\n\n⏱️ Time: ${res.timeMs || "N/A"} ms`
          : res.error || "Unknown error"
      );
      setVerdict(res.success ? "success" : "error");
    } catch (err) {
      console.error("Run error:", err);
      setOutput(err?.data?.error || "❌ Failed to run the code.");
      setVerdict("error");
    }
  };

  const handleSubmit = async () => {
    if (!problemId) {
      setOutput("⚠️ Problem ID not found.");
      return;
    }

    setOutput("📤 Submitting code...");
    setVerdict("Pending");
    setSubmissionId(null);
    if (pollingInterval) clearInterval(pollingInterval);

    try {
      const res = await submitCode({ problemId, language, code }).unwrap();
      setSubmissionId(res.data.submissionId);
      setOutput("⏳ Waiting for verdict...");
      toast.success("Code submitted");
    } catch {
      setOutput("❌ Submission failed.");
      setVerdict("error");
    }
  };

  const handleReset = () => {
    loadBoilerplate(language, updateCode);
    setInput("");
    setOutput("");
    setVerdict(null);
    setSubmissionId(null);
    if (pollingInterval) clearInterval(pollingInterval);
    reset();
    toast.success("Code reset");
  };

  return (
    <div className="bg-[#0e1117] text-white p-4 space-y-5 rounded-xl shadow-inner border border-[#1c2030]">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <LanguageSelector
          language={language}
          setLanguage={(lang) => {
            updateLanguage(lang);
            loadBoilerplate(lang, updateCode);
            setInput("");
            setOutput("");
            setVerdict(null);
            setSubmissionId(null);
            if (pollingInterval) clearInterval(pollingInterval);
            toast.success(`Language changed to ${lang.toUpperCase()}`);
          }}
        />

        <ActionButtons
          handleRun={handleRun}
          handleSubmit={handleSubmit}
          handleReset={handleReset}
          running={running}
          submitting={submitting}
        />
      </div>

      <MonacoEditor code={code} setCode={updateCode} language={language} />


      <OutputBox output={output} verdict={verdict} />
      <CustomInput input={input} setInput={setInput} />
    </div>
  );
};

export default CodeEditor;

// ---------------- Subcomponents ----------------

const LanguageSelector = ({ language, setLanguage }) => (
  <div className="flex items-center gap-3">
    <span className="text-sm text-gray-400">Language:</span>
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="bg-[#1e2330] border border-[#2a2f3d] px-3 py-1 rounded-md text-blue-300"
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
    onChange={(val) => setCode(val || "")}
    options={{
      fontSize: 14,
      minimap: { enabled: false },
      scrollbar: {
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 6,
      },
      padding: { top: 10 },
    }}
  />
);

const CustomInput = ({ input, setInput }) => (
  <textarea
    rows="3"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    className="w-full bg-[#1e2330] p-2 rounded-md border border-[#2a2f3d] text-sm font-mono text-blue-200"
    placeholder="Enter custom input…"
  />
);

const ActionButtons = ({ handleRun, handleSubmit, handleReset, running, submitting }) => (
  <div className="flex flex-wrap justify-end gap-3">
    <ActionButton
      onClick={handleReset}
      loading={false}
      label="Reset"
      icon={<FaUndo />}
      color="gray"
    />
    <ActionButton
      onClick={handleRun}
      loading={running}
      label="Run"
      icon={<FaPlay />}
      color="green"
    />
    <ActionButton
      onClick={handleSubmit}
      loading={submitting}
      label="Submit"
      icon={<FaUpload />}
      color="blue"
    />
  </div>
);

const ActionButton = ({ onClick, loading, label, icon, color }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-white shadow transition cursor-pointer ${
      loading
        ? "bg-gray-600 cursor-not-allowed"
        : `bg-${color}-700 hover:bg-${color}-600`
    }`}
  >
    {icon}
    {loading ? `${label}…` : label}
  </button>
);

const OutputBox = ({ output, verdict }) => {
  const getVerdictStyle = () => {
    switch (verdict?.toLowerCase()) {
      case "success":
      case "accepted":
        return {
          border: "border-green-600",
          icon: <FaCheckCircle className="text-green-400 text-lg" />,
          pill: "bg-green-700 text-green-100",
          text: "text-green-300",
          label: verdict,
        };
      case "pending":
        return {
          border: "border-yellow-600",
          icon: (
            <FaHourglassHalf className="text-yellow-400 text-lg animate-pulse" />
          ),
          pill: "bg-yellow-700 text-yellow-100",
          text: "text-yellow-300",
          label: verdict,
        };
      case "error":
        return {
          border: "border-red-600",
          icon: <FaTimesCircle className="text-red-400 text-lg" />,
          pill: "bg-red-700 text-red-100",
          text: "text-red-300",
          label: verdict || "Error",
        };
      default:
        return {
          border: "border-gray-700",
          icon: null,
          pill: null,
          text: "text-gray-300",
          label: null,
        };
    }
  };

  const { border, icon, pill, text, label } = getVerdictStyle();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`rounded-xl border ${border} bg-[#1e2330] shadow-md overflow-hidden`}
    >
      <div className="flex justify-between items-center px-4 py-2 border-b border-[#2a2f3d] bg-[#141824]">
        <div className="flex items-center gap-2 text-sm font-medium text-blue-200">
          {icon}
          <span>Program Output</span>
        </div>
        {label && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full uppercase tracking-wide ${pill}`}
          >
            {label}
          </span>
        )}
      </div>

      <div
        className={`p-4 text-sm font-mono max-h-[200px] min-h-[110px] overflow-auto ${text} whitespace-pre-wrap`}
      >
        {output || (
          <span className="text-gray-500">✨ Your output will appear here…</span>
        )}
      </div>
    </motion.div>
  );
};

// ---------------- Utilities ----------------

function loadBoilerplate(language, setCode) {
  fetch("/data.json")
    .then((res) => res.json())
    .then((data) => setCode(data[language] || ""))
    .catch(() => setCode(""));
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
