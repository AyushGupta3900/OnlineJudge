import { useState, useEffect, useRef } from "react";
import { FaPlay, FaUndo, FaUpload } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import {
  useSubmitCodeMutation,
  useLazyGetSubmissionByIdQuery,
} from "../redux/api/submissionAPI.js";
import { useRunCodeMutation } from "../redux/api/compilerAPI.js";
import {
  useGetAIReviewMutation,
  useGenerateBoilerplateMutation,
  useGenerateAiHintMutation,
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
  loadBoilerplate,
  handleAIHint,
  formatSubmissionOutput,
} from "../utils/codeEditorUtils.js";

const LANGUAGES = ["cpp", "python", "javascript", "java"];
const MySwal = withReactContent(Swal);

const CodeEditor = ({ problemId: propId }) => {
  const { id: routeId } = useParams();
  const problemId = propId || routeId;

  const { isAuthenticated } = useSelector((state) => state.auth);

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);
  const [verdictToastId, setVerdictToastId] = useState(null);

  const [submitCode, { isLoading: submitting }] = useSubmitCodeMutation();
  const [runCode, { isLoading: running }] = useRunCodeMutation();
  const [fetchSubmission] = useLazyGetSubmissionByIdQuery();
  const [getAIReview, { isLoading: aiReviewLoading }] =
    useGetAIReviewMutation();
  const [generateBoilerplate] = useGenerateBoilerplateMutation();
  const [generateAiHint, { isLoading: aiHintLoading }] =
    useGenerateAiHintMutation();

  const { code, language, updateCode, updateLanguage } = useCode(problemId);

  const [aiReviewVisible, setAiReviewVisible] = useState(false);
  const [aiReviewText, setAiReviewText] = useState("");

  const [hintVisible, setHintVisible] = useState(false);
  const [hintText, setHintText] = useState("");

  const aiReviewRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  const hasLoadedBoilerplateRef = useRef(false);

  useEffect(() => {
    if (!hasLoadedBoilerplateRef.current && (!code || code.trim() === "")) {
      loadBoilerplate(language, updateCode);
      hasLoadedBoilerplateRef.current = true;
    }
  }, [problemId, language, updateCode]);

  useEffect(() => {
    if (!submissionId) return;

    let elapsed = 0;
    const pollInterval = 2000;
    const maxTime = 120000;

    pollingIntervalRef.current = setInterval(async () => {
      elapsed += pollInterval;

      if (elapsed >= maxTime) {
        setOutput("⏳ Timeout: Failed to get verdict in time.");
        if (verdictToastId) {
          toast.error("⏳ Timeout: Failed to get verdict.", {
            id: verdictToastId,
          });
          setVerdictToastId(null);
        }
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        return;
      }

      try {
        const res = await fetchSubmission(submissionId).unwrap();
        const currentVerdict = res.submission?.verdict;

        if (!currentVerdict) {
          setOutput("⚠️ Verdict not yet available.");
          return;
        }

        setVerdict(currentVerdict);

        if (currentVerdict !== "Pending") {
          setOutput(formatSubmissionOutput(res.submission));

          if (verdictToastId) {
            if (currentVerdict === "Accepted") {
              toast.success("Verdict: Accepted", { id: verdictToastId });
            } else {
              toast.error(`Verdict: ${currentVerdict}`, { id: verdictToastId });
            }
            setVerdictToastId(null);
          }

          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      } catch {
        setOutput("❌ Failed to fetch verdict.");
        if (verdictToastId) {
          toast.error("❌ Failed to fetch verdict", { id: verdictToastId });
          setVerdictToastId(null);
        }
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }, pollInterval);

    return () => {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    };
  }, [submissionId, fetchSubmission, verdictToastId]);

  const confirmReset = async () => {
    const result = await MySwal.fire({
      title: "Reset Editor?",
      text: "All unsaved changes will be lost.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reset",
      cancelButtonText: "Cancel",
      background: "#1f2937",
      color: "#f8fafc",
      iconColor: "#f87171",
      customClass: {
        popup: "rounded-xl",
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded",
        cancelButton:
          "bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded",
      },
    });
    if (result.isConfirmed) {
      handleReset(
        language,
        updateCode,
        setInput,
        setOutput,
        setVerdict,
        setSubmissionId,
        pollingIntervalRef
      );
    }
  };

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
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
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
            onClick={confirmReset}
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
            onClick={async () => {
              if (!isAuthenticated) {
                toast.error("Please log in to submit your code.");
                return;
              }

              const toastId = await handleSubmit(
                problemId,
                language,
                code,
                setOutput,
                setVerdict,
                setSubmissionId,
                pollingIntervalRef,
                submitCode
              );

              if (toastId) setVerdictToastId(toastId);
            }}
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
        aiReviewRef={aiReviewRef}
      />

      <textarea
        rows="3"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full bg-[#1e2330] p-2 rounded-md border border-[#2a2f3d] text-sm font-mono text-blue-200"
        placeholder="Enter custom input…"
      />

      <FloatingAIButtons
        onReview={() => {
          handleAIReview(
            code,
            language,
            problemId,
            setAiReviewVisible,
            setAiReviewText,
            getAIReview
          );
          setTimeout(() => {
            aiReviewRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 300);
        }}
        onBoilerplate={() =>
          handleAIBoilerplate(
            problemId,
            language,
            updateCode,
            generateBoilerplate
          )
        }
        onHint={() =>
          handleAIHint(
            problemId,
            code,
            language,
            setHintVisible,
            setHintText,
            generateAiHint
          )
        }
      />

      <HintModal
        visible={hintVisible}
        onClose={() => setHintVisible(false)}
        hintText={hintText}
        loading={aiHintLoading}
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

const HintModal = ({ visible, onClose, hintText, loading }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[#0e1117] border border-[#2a2f3d] rounded-lg shadow-lg p-6 max-w-lg w-full text-white">
        <h2 className="text-lg font-semibold text-yellow-400 mb-3">
          💡 AI Hint
        </h2>
        <div className="text-sm whitespace-pre-wrap text-gray-300 max-h-[300px] overflow-y-auto">
          {loading ? "Generating hint…" : hintText || "No hint available."}
        </div>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
