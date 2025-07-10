import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
} from "react-icons/fa";

import "highlight.js/styles/github-dark.css";

const OutputBox = ({
  output,
  verdict,
  onAIReview,
  aiReviewVisible,
  aiReviewLoading,
  aiReviewText,
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

  const getVerdictStyle = () => {
    switch (verdict?.toLowerCase()) {
      case "success":
      case "accepted":
        return {
          border: "border-green-600",
          icon: <FaCheckCircle className="text-green-400 text-lg" />,
        };
      case "pending":
        return {
          border: "border-yellow-600",
          icon: (
            <FaHourglassHalf className="text-yellow-400 text-lg animate-pulse" />
          ),
        };
      case "error":
        return {
          border: "border-red-600",
          icon: <FaTimesCircle className="text-red-400 text-lg" />,
        };
      default:
        return { border: "border-gray-700", icon: null };
    }
  };

  const { border, icon } = getVerdictStyle();

  const renderers = {
    strong: ({ children }) => {
      const colorClass =
        randomColorClasses[Math.floor(Math.random() * randomColorClasses.length)];
      return <strong className={colorClass}>{children}</strong>;
    },
    li: ({ children }) => <li className="mb-2">{children}</li>,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl border ${border} bg-[#1e2330] shadow-md overflow-hidden`}
    >
      <div className="flex justify-between items-center px-4 py-2 border-b border-[#2a2f3d] bg-[#141824] relative">
        <div className="flex items-center gap-2 text-sm font-medium text-blue-200">
          {icon}
          <span>Program Output</span>
        </div>
      </div>

      <div className="p-4 text-sm font-mono max-h-[200px] min-h-[110px] overflow-auto whitespace-pre-wrap">
        {output || (
          <span className="text-gray-500">✨ Your output will appear here…</span>
        )}
      </div>

      {aiReviewVisible && (
        <div className="p-4 text-sm mt-2 bg-[#141824] border border-[#2a2f3d] rounded-md text-blue-200 max-h-64 overflow-auto">
          {aiReviewLoading ? (
            <span>🤖 Generating AI review...</span>
          ) : (
            <div className="prose prose-sm max-w-none prose-invert space-y-3 prose-pre:bg-[#0e1117] prose-code:text-sm">
              <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                components={renderers}
              >
                {aiReviewText}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default OutputBox;
