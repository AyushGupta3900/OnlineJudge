import { useState } from "react";
import { motion } from "framer-motion";

const FloatingAIButtons = ({ onReview, onBoilerplate }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end space-y-2 z-50">
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2"
        >
          <button
            onClick={onReview}
            className="px-3 py-1 bg-[#1e2330] hover:bg-[#2a2f3d] text-sm rounded shadow text-blue-300 border border-blue-500/50 transition-colors cursor-pointer"
          >
            🤖 AI Review
          </button>
          <button
            onClick={onBoilerplate}
            className="px-3 py-1 bg-[#1e2330] hover:bg-[#2a2f3d] text-sm rounded shadow text-green-300 border border-green-500/50 transition-colors cursor-pointer"
          >
            🧪 AI Boilerplate
          </button>
        </motion.div>
      )}

      {/* MAIN BUTTON */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative w-12 h-12 rounded-full flex items-center justify-center text-2xl cursor-pointer group"
        title="AI Options"
      >
        {/* Rotating wider gradient border */}
        <span
          className="absolute inset-0 rounded-full z-0"
          style={{
            background: "conic-gradient(from 0deg, cyan, fuchsia, cyan)",
            animation: "spin 2s linear infinite",
            mask: "radial-gradient(circle closest-side, transparent 75%, black)",
            WebkitMask: "radial-gradient(circle closest-side, transparent 75%, black)",
          }}
        ></span>

        {/* Inner dark circle */}
        <span className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center bg-[#1e2330] group-hover:bg-[#2a2f3d] shadow-lg transition">
          🤖
        </span>
      </button>

      {/* Inline keyframes */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default FloatingAIButtons;
