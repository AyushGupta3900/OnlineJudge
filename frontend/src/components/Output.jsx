import { useMemo } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaRobot,
} from "react-icons/fa";

import "highlight.js/styles/github-dark.css";

const OutputBox = ({
  output = "",
  verdict = "",
  aiReviewVisible = false,
  aiReviewLoading = false,
  aiReviewText = "",
  aiReviewRef, 
}) => {
  const randomColorClasses = [
    "text-pink-400",
    "text-blue-400",
    "text-yellow-400",
    "text-green-400",
    "text-purple-400",
    "text-cyan-400",
    "text-orange-400",
  ];

  const randomColorClass = useMemo(() => {
    const idx = Math.floor(Math.random() * randomColorClasses.length);
    return randomColorClasses[idx];
  }, []);

  const verdictStyles = {
    accepted: {
      color: "bg-green-600/20 text-green-400",
      icon: <FaCheckCircle className="text-green-400" />,
      label: "Accepted",
    },
    success: {
      color: "bg-green-600/20 text-green-400",
      icon: <FaCheckCircle className="text-green-400" />,
      label: "Success",
    },
    pending: {
      color: "bg-yellow-600/20 text-yellow-400 animate-pulse",
      icon: <FaHourglassHalf className="text-yellow-400" />,
      label: "Pending",
    },
    "wrong answer": {
      color: "bg-red-600/20 text-red-400",
      icon: <FaTimesCircle className="text-red-400" />,
      label: "WA",
    },
    "time limit exceeded": {
      color: "bg-red-600/20 text-red-400",
      icon: <FaTimesCircle className="text-red-400" />,
      label: "TLE",
    },
    "memory limit exceeded": {
      color: "bg-red-600/20 text-red-400",
      icon: <FaTimesCircle className="text-red-400" />,
      label: "MLE",
    },
    "compilation error": {
      color: "bg-red-600/20 text-red-400",
      icon: <FaTimesCircle className="text-red-400" />,
      label: "Compilation Error",
    },
    "runtime error": {
      color: "bg-red-600/20 text-red-400",
      icon: <FaTimesCircle className="text-red-400" />,
      label: "Runtime Error",
    },
  };

  const { color, icon, label } =
    verdictStyles[verdict?.toLowerCase()] || {
      color: "bg-gray-700/30 text-gray-400",
      icon: null,
      label: "No Verdict",
    };

  const renderers = {
    strong: ({ children }) => (
      <strong className={randomColorClass}>{children}</strong>
    ),
    li: ({ children }) => <li className="mb-1">{children}</li>,
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-[#2f3547] bg-[#161b29] min-h-40 shadow-lg overflow-hidden flex flex-col gap-2"
      aria-live="polite"
    >
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-3 bg-[#1d2235] border-b border-[#2f3547]">
        <div className="flex items-center gap-2 text-base font-semibold text-blue-200">
          {icon}
          <span>Program Output</span>
        </div>
        <span
          className={`px-2 py-0.5 text-xs rounded-full font-medium ${color}`}
        >
          {label}
        </span>
      </header>

      {/* Output */}
      <pre
        className="px-4 py-3 text-sm font-mono bg-[#10131f] rounded-md m-4 text-gray-200 min-h-20 max-h-56 overflow-auto whitespace-pre-wrap shadow-inner"
        aria-label="Output"
      >
        {output.trim() || (
          <span className="text-gray-500">✨ Your output will appear here…</span>
        )}
      </pre>

      {/* AI Review */}
      {aiReviewVisible && (
        <motion.div
          ref={aiReviewRef} // 👈 added ref
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="px-4 pb-4"
        >
          {/* AI Review Header */}
          <div className="flex justify-between items-center px-4 py-3 bg-[#1d2235] border border-[#2f3547] rounded-t-xl">
            <div className="flex items-center gap-2 text-base font-semibold text-blue-200">
              <FaRobot className="text-yellow-400" />
              <span>AI Review</span>
            </div>
          </div>

          <div className="p-3 text-sm bg-[#202638] border-x border-b border-[#2f3547] rounded-b-xl text-blue-100 shadow-inner">
            {aiReviewLoading ? (
              <span>🤖 Generating AI review...</span>
            ) : (
              <div
                className="
                  prose prose-sm max-w-none prose-invert space-y-2 
                  prose-pre:bg-[#0e1117] prose-code:text-sm
                  max-h-64 overflow-y-auto pr-2
                "
              >
                <ReactMarkdown
                  rehypePlugins={[rehypeHighlight]}
                  components={renderers}
                >
                  {aiReviewText}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.section>
  );
};

export default OutputBox;