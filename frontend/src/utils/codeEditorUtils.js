import toast from "react-hot-toast";

export const loadBoilerplate = (language, setCode) => {
  fetch("/data.json")
    .then((res) => res.json())
    .then((data) => setCode(data[language] || ""))
    .catch(() => setCode(""));
};

export const formatSubmissionOutput = (submission) => {
  const verdict = submission.verdict;
  if (!verdict) return "⚠️ No verdict available.";

  if (verdict === "Accepted") {
    return (
      `✅ Accepted\n` +
      `🚀 Execution Time: ${submission.executionTime} ms\n` +
      `📦 Memory Used: ${submission.memoryUsed} KB\n` +
      `🧪 Test Cases Passed: ${submission.passedTestCases} / ${submission.totalTestCases}`
    );
  }

  if (verdict === "Wrong Answer") {
    return (
      `❌ 🔍 Wrong Answer\n` +
      `🚀 Execution Time: ${submission.executionTime} ms\n` +
      `📦 Memory Used: ${submission.memoryUsed} KB\n` +
      `🧪 Test Cases Passed: ${submission.passedTestCases} / ${submission.totalTestCases}`
    );
  }

  if (
    verdict === "Time Limit Exceeded" ||
    verdict === "Memory Limit Exceeded"
  ) {
    return (
      `⏳ ⚠️ ${verdict}\n` +
      `🧪 Test Cases Passed: ${submission.passedTestCases} / ${submission.totalTestCases}`
    );
  }

  if (verdict === "Compilation Error") {
    return (
      `🛠️ 🧨 Compilation Error\n` +
      `📄 Message: ${submission.error || "No details provided."}`
    );
  }

  if (verdict === "Runtime Error") {
    return (
      `💥 🐞 Runtime Error\n` +
      `📄 Message: ${submission.error || "No details provided."}`
    );
  }

  return `ℹ️ Verdict: ${verdict}`;
};

export const handleRun = async (
  language,
  code,
  input,
  setOutput,
  setVerdict,
  runCode
) => {
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
    setOutput(err?.data?.error || "❌ Failed to run the code.");
    setVerdict("error");
  }
};

export const handleSubmit = async (
  problemId,
  language,
  code,
  setOutput,
  setVerdict,
  setSubmissionId,
  pollingInterval,
  submitCode
) => {
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

export const handleReset = (
  language,
  updateCode,
  setInput,
  setOutput,
  setVerdict,
  setSubmissionId,
  pollingInterval
) => {
  loadBoilerplate(language, updateCode);
  setInput("");
  setOutput("");
  setVerdict(null);
  setSubmissionId(null);
  if (pollingInterval) clearInterval(pollingInterval);
  toast.success("Code reset");
};

export const handleAIReview = async (
  code,
  language,
  problemId,
  setAiReviewVisible,
  setAiReviewText,
  getAIReview
) => {
  setAiReviewVisible(true);
  setAiReviewText("");
  toast.loading("Generating AI Review...");
  try {
    const res = await getAIReview({
      code,
      language,
      problemId,
    }).unwrap();
    setAiReviewText(res.review || "No review available.");
    toast.dismiss();
    toast.success("Review generated");
  } catch (err) {
    toast.dismiss();
    toast.error(err?.data?.message || "Failed to generate AI Review.");
    setAiReviewText(err?.data?.message || "Failed to fetch AI review.");
  }
};

export const handleAIBoilerplate = async (
  problemId,
  language,
  updateCode,
  generateBoilerplate
) => {
  if (!problemId) {
    toast.error("⚠️ Problem ID not found.");
    return;
  }
  toast.loading("Generating AI boilerplate...");
  try {
    const res = await generateBoilerplate({ language, problemId }).unwrap();
    updateCode(res.boilerplate || "");
    toast.dismiss();
    toast.success("AI Boilerplate generated");
  } catch (err) {
    toast.dismiss();
    toast.error(err?.data?.message || "Failed to generate AI boilerplate.");
  }
};

export const handleAIHint = async (
  problemId,
  code,
  language,
  setHintVisible,
  setHintText,
  generateAiHint
) => {
  if (!problemId) {
    toast.error("⚠️ Problem ID not found.");
    return;
  }

  setHintVisible(true);
  setHintText("");
  toast.loading("Generating AI Hint...");

  try {
    const res = await generateAiHint({
      problemId,
      code: code || "",           
      language: language,
    }).unwrap();

    setHintText(res.hint || "No hint available.");
    toast.dismiss();
    toast.success("Hint generated");
  } catch (err) {
    toast.dismiss();
    toast.error(err?.data?.message || "Failed to generate AI hint.");
    setHintText(err?.data?.message || "Failed to fetch AI hint.");
  }
};
