import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetSubmissionsByProblemQuery } from "../redux/api/submissionAPI.js";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

const SubmissionPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetSubmissionsByProblemQuery(id);
  const submissions = data?.submissions || [];

  const sortedSubmissions = [...submissions].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 5;

  const totalPages = Math.ceil(sortedSubmissions.length / submissionsPerPage);
  const startIndex = (currentPage - 1) * submissionsPerPage;
  const currentSubmissions = sortedSubmissions.slice(
    startIndex,
    startIndex + submissionsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-950 text-white px-4 py-10"
    >
      <div className="max-w-5xl mx-auto">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
        >
          📄 Your Submissions
        </motion.h1>

        {isLoading ? (
          <p className="text-blue-300 animate-pulse">Loading submissions...</p>
        ) : isError ? (
          <p className="text-red-500">⚠️ Failed to load submissions.</p>
        ) : sortedSubmissions.length === 0 ? (
          <p className="text-gray-400">
            You haven't submitted anything yet for this problem.
          </p>
        ) : (
          <>
            <div className="space-y-6">
              {currentSubmissions.map((submission, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={submission._id || index}
                  className="border border-gray-700 rounded-2xl p-5 bg-gray-900 shadow-md transition hover:shadow-blue-500/30"
                >
                  <div className="flex flex-wrap items-center justify-between mb-3 text-sm gap-2">
                    <span>
                      <span className="font-medium text-gray-400">Language: </span>
                      <span className="text-blue-400">
                        {submission.language || "N/A"}
                      </span>
                    </span>
                    <span>
                      <span className="font-medium text-gray-400">Verdict: </span>
                      <span
                        className={`font-bold ${
                          submission.verdict === "Accepted"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {submission.verdict || "N/A"}
                      </span>
                    </span>
                    <span className="text-gray-400">
                      {submission.createdAt
                        ? formatDistanceToNow(new Date(submission.createdAt), {
                            addSuffix: true,
                          })
                        : "Unknown time"}
                    </span>
                  </div>

                  <pre className="bg-black/60 p-4 rounded-lg text-sm text-gray-200 overflow-x-auto whitespace-pre-wrap max-h-96 border border-gray-800">
                    {submission.code || "// No code available"}
                  </pre>
                </motion.div>
              ))}
            </div>

            {/* Responsive Pagination */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 overflow-x-auto"
            >
              <div className="inline-flex flex-nowrap gap-2 px-1">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-1.5 rounded-lg bg-gray-800 text-white border border-gray-600 hover:bg-blue-600 disabled:opacity-40 cursor-pointer"
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i + 1)}
                    className={`px-4 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-1.5 rounded-lg bg-gray-800 text-white border border-gray-600 hover:bg-blue-600 disabled:opacity-40 cursor-pointer"
                >
                  Next →
                </button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default SubmissionPage;
