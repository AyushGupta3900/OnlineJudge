import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetSubmissionsByProblemQuery } from "../../redux/api/submissionAPI.js";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import AdminPagination from "../../components/AdminPagination.jsx";
import PageHeader from "../../components/PageHeader.jsx";

// TestCase Table
const TestCaseTable = ({ testCaseResults = [] }) => (
  <div className="mt-3 overflow-x-auto">
    <table className="min-w-full text-xs text-left border border-gray-700">
      <thead className="bg-gray-800 text-gray-300">
        <tr>
          <th className="p-2">#</th>
          <th className="p-2">Input</th>
          <th className="p-2">Expected</th>
          <th className="p-2">Actual</th>
          <th className="p-2">Time (ms)</th>
          <th className="p-2">Memory (KB)</th>
          <th className="p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {testCaseResults.length === 0 ? (
          <tr>
            <td colSpan="7" className="text-center text-gray-400 p-2">
              No test case results.
            </td>
          </tr>
        ) : (
          testCaseResults.map((tc, i) => (
            <tr key={i} className="border-t border-gray-700 hover:bg-gray-800">
              <td className="p-1">{tc.testCase}</td>
              <td className="p-1">{tc.input}</td>
              <td className="p-1">{tc.expectedOutput}</td>
              <td className="p-1">{tc.actualOutput}</td>
              <td className="p-1">{tc.executionTimeMs}</td>
              <td className="p-1">{tc.memoryKb}</td>
              <td
                className={`p-1 ${
                  tc.status === "Passed"
                    ? "text-green-400"
                    : tc.status === "Failed"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {tc.status}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

// Submission Card
const SubmissionCard = ({ submission, delay, expanded, toggleExpand }) => {
  let timeAgo = "N/A";
  try {
    timeAgo = formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true });
  } catch {
    timeAgo = "Invalid Date";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-xl border border-gray-700 bg-gray-900 shadow-md hover:shadow-blue-500/30 p-4"
    >
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">
          <span className="font-medium">Language: </span>
          <span className="text-blue-400">{submission.language || "N/A"}</span>
        </span>
        <span className="text-gray-400">{timeAgo}</span>
      </div>

      <div className="flex flex-wrap gap-4 text-sm mb-2">
        <div>
          <span className="font-medium text-gray-400">Verdict: </span>
          <span
            className={`font-semibold ${
              submission.verdict === "Accepted" ? "text-green-400" : "text-red-400"
            }`}
          >
            {submission.verdict || "N/A"}
          </span>
        </div>
        {submission.executionTime != null && (
          <div>
            <span className="text-gray-400">⏱ {submission.executionTime} ms</span>
          </div>
        )}
        {submission.memoryUsed != null && (
          <div>
            <span className="text-gray-400">💾 {submission.memoryUsed} KB</span>
          </div>
        )}
        <div>
          <span className="text-gray-400">
            ✅ {submission.passedTestCases ?? 0}/{submission.totalTestCases ?? 0}
          </span>
        </div>
      </div>

      {submission.error && (
        <p className="text-xs text-red-400 bg-black/30 p-2 rounded mb-2">
          Error: {submission.error}
        </p>
      )}

      <button
        onClick={() => toggleExpand(submission._id)}
        className="text-xs text-blue-400 hover:underline cursor-pointer"
      >
        {expanded === submission._id ? "Hide Testcase Details ▲" : "Show Testcase Details ▼"}
      </button>

      {expanded === submission._id && (
        <TestCaseTable testCaseResults={submission.testCaseResults} />
      )}

      <pre className="bg-gray-800/70 p-3 mt-3 rounded-md text-xs text-gray-200 overflow-x-auto max-h-48 border border-gray-700">
        {submission.code || "// No code"}
      </pre>
    </motion.div>
  );
};

// Main Component
const SubmissionPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetSubmissionsByProblemQuery(id);

  const submissions = Array.isArray(data?.submissions) ? data.submissions : [];
  const sortedSubmissions = [...submissions].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState(null);

  const submissionsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(sortedSubmissions.length / submissionsPerPage));

  const currentSubmissions = sortedSubmissions.slice(
    (currentPage - 1) * submissionsPerPage,
    currentPage * submissionsPerPage
  );

  const handleToggleExpand = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const heading = "Submissions Dashboard";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-950 text-white px-6 py-8"
    >
      <div className="max-w-6xl mx-auto">
        <PageHeader heading={heading} />

        {isLoading ? (
          <p className="text-blue-300 animate-pulse">Loading submissions...</p>
        ) : isError ? (
          <p className="text-red-500">⚠️ Failed to load submissions.</p>
        ) : sortedSubmissions.length === 0 ? (
          <p className="text-gray-400">No submissions yet for this problem.</p>
        ) : (
          <>
            <div className="grid gap-6">
              {currentSubmissions.map((sub, idx) => (
                <SubmissionCard
                  key={sub._id}
                  submission={sub}
                  delay={idx * 0.05}
                  expanded={expanded}
                  toggleExpand={handleToggleExpand}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default SubmissionPage;
