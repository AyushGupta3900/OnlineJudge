import { useState, useEffect } from "react";
import { FaPlay, FaUndo, FaUpload } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";

import {
  useSubmitCodeMutation,
  useLazyGetSubmissionByIdQuery,
} from "../redux/api/submissionAPI.js";
import { useRunCodeMutation } from "../redux/api/compilerAPI.js";
import {
  useGetAIReviewMutation,
  useGenerateBoilerplateMutation,
} from "../redux/api/aiAPI.js";

import useCode from "../hooks/useCode";
import OutputBox from "./Output.jsx";
import FloatingAIButtons from "./FloatingAIButtons.jsx";

import {
  handleRun,
  handleSubmit,
  handleReset,
  handleAIReview,
  handleAIBoilerplate,
  loadBoilerplate
} from "../utils/codeEditorUtils.js";

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
  const [getAIReview, { isLoading: aiReviewLoading }] =
    useGetAIReviewMutation();
  const [generateBoilerplate] = useGenerateBoilerplateMutation();

  const { code, language, updateCode, updateLanguage } = useCode(problemId);

  const [aiReviewVisible, setAiReviewVisible] = useState(false);
  const [aiReviewText, setAiReviewText] = useState("");

  useEffect(() => {
    if (code === null) loadBoilerplate(language, updateCode);
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
          clearInterval(interval);
          setPollingInterval(null);
        }
      } catch {
        setOutput("❌ Failed to fetch verdict.");
        clearInterval(interval);
        setPollingInterval(null);
      }
    }, 2000);

    setPollingInterval(interval);

    return () => clearInterval(interval);
  }, [submissionId, fetchSubmission]);

  return (
    <div className="bg-[#0e1117] text-white p-4 space-y-5 rounded-xl shadow-inner border border-[#1c2030]">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Language:</span>
          <select
            value={language}
            onChange={(e) => {
              updateLanguage(e.target.value);
              loadBoilerplate(e.target.value, updateCode);
              setInput("");
              setOutput("");
              setVerdict(null);
              setSubmissionId(null);
              if (pollingInterval) clearInterval(pollingInterval);
              toast.success(
                `Language changed to ${e.target.value.toUpperCase()}`
              );
            }}
            className="bg-[#1e2330] border border-[#2a2f3d] px-3 py-1 rounded-md text-blue-300"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap justify-end gap-3">
          <ActionButton
            onClick={() =>
              handleReset(
                language,
                updateCode,
                setInput,
                setOutput,
                setVerdict,
                setSubmissionId,
                pollingInterval
              )
            }
            label="Reset"
            icon={<FaUndo />}
            color="gray"
          />
          <ActionButton
            onClick={() =>
              handleRun(language, code, input, setOutput, setVerdict, runCode)
            }
            label="Run"
            icon={<FaPlay />}
            color="green"
            loading={running}
          />
          <ActionButton
            onClick={() =>
              handleSubmit(
                problemId,
                language,
                code,
                setOutput,
                setVerdict,
                setSubmissionId,
                pollingInterval,
                submitCode
              )
            }
            label="Submit"
            icon={<FaUpload />}
            color="blue"
            loading={submitting}
          />
        </div>
      </div>

      <Editor
        height="420px"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(val) => updateCode(val || "")}
        options={{ fontSize: 14, minimap: { enabled: false } }}
      />

      <OutputBox
        output={output}
        verdict={verdict}
        aiReviewVisible={aiReviewVisible}
        aiReviewLoading={aiReviewLoading}
        aiReviewText={aiReviewText}
      />

      <textarea
        rows="3"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full bg-[#1e2330] p-2 rounded-md border border-[#2a2f3d] text-sm font-mono text-blue-200"
        placeholder="Enter custom input…"
      />

      <FloatingAIButtons
        onReview={() =>
          handleAIReview(
            code,
            language,
            problemId,
            setAiReviewVisible,
            setAiReviewText,
            getAIReview
          )
        }
        onBoilerplate={() =>
          handleAIBoilerplate(
            problemId,
            language,
            updateCode,
            generateBoilerplate
          )
        }
      />
    </div>
  );
};

const ActionButton = ({ onClick, label, icon, color, loading }) => (
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

export default CodeEditor;
