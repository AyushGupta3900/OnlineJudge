import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaClock, FaChevronDown, FaChevronUp } from "react-icons/fa";

import { useGetAllUserSubmissionsQuery } from "../../redux/api/userAPI";
import AdminPagination from "../../components/AdminPagination";
import PageHeader from "../../components/PageHeader";

const verdictColors = {
  Accepted: "text-green-500",
  "Wrong Answer": "text-red-500",
  Pending: "text-yellow-400",
  "Time Limit Exceeded": "text-orange-500",
  "Memory Limit Exceeded": "text-orange-400",
  "Runtime Error": "text-pink-500",
  "Compilation Error": "text-purple-500",
};

const verdictOptions = [
  "",
  "Accepted",
  "Wrong Answer",
  "Pending",
  "Time Limit Exceeded",
  "Memory Limit Exceeded",
  "Runtime Error",
  "Compilation Error",
];

const languageOptions = ["", "cpp", "python", "java", "javascript"];

const TableSkeleton = ({ rows = 8 }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-md overflow-x-auto animate-pulse">
    <table className="w-full table-auto text-left">
      <thead className="bg-gray-800 text-gray-300 text-sm uppercase tracking-wide">
        <tr>
          <th className="px-6 py-4">#</th>
          <th className="px-6 py-4">Problem</th>
          <th className="px-6 py-4">Language</th>
          <th className="px-6 py-4">Verdict</th>
          <th className="px-6 py-4">Submitted At</th>
          <th className="px-6 py-4">Code</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, idx) => (
          <tr key={idx} className="border-t border-gray-800">
            {Array.from({ length: 6 }).map((__, col) => (
              <td key={col} className="px-6 py-6">
                <div className="h-4 w-full bg-gray-700 rounded"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const ErrorMessage = ({ message = "Failed to load submissions." }) => (
  <div className="min-h-screen flex items-center justify-center text-red-500">
    {message}
  </div>
);

const SubmissionsTable = ({ submissions, expandedRows, toggleRow, startIndex }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-md overflow-x-auto">
    <table className="w-full table-auto text-left">
      <thead className="bg-gray-800 text-gray-300 text-sm uppercase tracking-wide">
        <tr>
          <th className="px-6 py-4">#</th>
          <th className="px-6 py-4">Problem</th>
          <th className="px-6 py-4">Language</th>
          <th className="px-6 py-4">Verdict</th>
          <th className="px-6 py-4">Submitted At</th>
          <th className="px-6 py-4">Code</th>
        </tr>
      </thead>
      <tbody>
        {submissions.map((s, idx) => {
          const dateStr = s.submittedAt
            ? new Date(s.submittedAt).toLocaleString()
            : "N/A";
          return (
            <React.Fragment key={startIndex + idx}>
              <tr className="border-t border-gray-800 hover:bg-gray-800 transition">
                <td className="px-6 py-4 text-sm">{startIndex + idx + 1}</td>
                <td className="px-6 py-4 text-sm">
                  <Link
                    to={`/problems/${s.problem?._id}`}
                    className="text-blue-400 hover:underline"
                  >
                    {s.problem?.title || "Unknown Problem"}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm capitalize">{s.language}</td>
                <td
                  className={`px-6 py-4 text-sm font-semibold ${
                    verdictColors[s.verdict] || "text-gray-300"
                  }`}
                >
                  {s.verdict}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400 flex gap-1 items-center">
                  <FaClock />
                  {dateStr}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => toggleRow(startIndex + idx)}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                  >
                    {expandedRows[startIndex + idx] ? (
                      <>
                        <FaChevronUp /> Hide
                      </>
                    ) : (
                      <>
                        <FaChevronDown /> Show
                      </>
                    )}
                  </button>
                </td>
              </tr>
              {expandedRows[startIndex + idx] && (
                <tr>
                  <td colSpan={6} className="p-3 bg-gray-900">
                    <pre className="whitespace-pre-wrap text-sm text-gray-200 bg-gray-800 rounded p-2 overflow-x-auto">
                      {s.code || "// No code available"}
                    </pre>
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  </div>
);

const AllSubmissionsPage = () => {
  const [expandedRows, setExpandedRows] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [verdictFilter, setVerdictFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");

  const submissionsPerPage = 10;

  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useGetAllUserSubmissionsQuery({
    page: currentPage,
    limit: submissionsPerPage,
    verdict: verdictFilter || undefined,
    language: languageFilter || undefined,
  });

  const submissions = data?.submissions || [];
  const totalPages = data?.totalPages || 1;

  const toggleRow = (idx) => {
    setExpandedRows((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleFilterChange = () => {
    setCurrentPage(1); // reset to page 1 on filter change
  };

  const heading = "All Submissions";

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-4">
        <PageHeader heading={heading} />

        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Verdict</label>
            <select
              className="bg-gray-800 text-white px-2 py-1 rounded"
              value={verdictFilter}
              onChange={(e) => {
                setVerdictFilter(e.target.value);
                handleFilterChange();
              }}
            >
              {verdictOptions.map((v) => (
                <option key={v} value={v}>
                  {v || "All"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-400">Language</label>
            <select
              className="bg-gray-800 text-white px-2 py-1 rounded"
              value={languageFilter}
              onChange={(e) => {
                setLanguageFilter(e.target.value);
                handleFilterChange();
              }}
            >
              {languageOptions.map((l) => (
                <option key={l} value={l}>
                  {l || "All"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isError ? (
          <ErrorMessage />
        ) : isLoading || isFetching ? (
          <TableSkeleton rows={8} />
        ) : submissions.length === 0 ? (
          <p className="text-center text-gray-400">No submissions yet.</p>
        ) : (
          <>
            <SubmissionsTable
              submissions={submissions}
              expandedRows={expandedRows}
              toggleRow={toggleRow}
              startIndex={(currentPage - 1) * submissionsPerPage}
            />

            {totalPages > 1 && (
              <AdminPagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllSubmissionsPage;
