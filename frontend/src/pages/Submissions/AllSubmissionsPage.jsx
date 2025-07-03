import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaClock, FaChevronDown, FaChevronUp } from "react-icons/fa";
import useAuthUser from "../../hooks/useAuthUser";
import { useGetProblemByIdQuery } from "../../redux/api/problemAPI";
import AdminPagination from "../../components/AdminPagination"

const verdictColors = {
  Accepted: "text-green-500",
  "Wrong Answer": "text-red-500",
  Pending: "text-yellow-400",
  "Time Limit Exceeded": "text-orange-500",
  "Memory Limit Exceeded": "text-orange-400",
  "Runtime Error": "text-pink-500",
  "Compilation Error": "text-purple-500",
};

const ProblemName = ({ problemId }) => {
  const { data, isLoading, isError } = useGetProblemByIdQuery(problemId);
  if (isLoading) return <span className="text-gray-400">Loading...</span>;
  if (isError || !data) return <span className="text-red-400">Error</span>;
  return <span>{data?.data?.title || problemId}</span>;
};

const SkeletonLoader = () => (
  <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6 text-center text-blue-400">
        📄 Your Submissions
      </h1>
      <div className="space-y-4 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-md h-12 w-full"></div>
        ))}
      </div>
    </div>
  </div>
);

const ErrorMessage = ({ message = "Failed to load submissions." }) => (
  <div className="min-h-screen flex items-center justify-center text-red-500">
    {message}
  </div>
);

const SubmissionsTable = ({
  submissions,
  expandedRows,
  toggleRow,
  indexOfFirst,
}) => (
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
        {submissions.map((s, idx) => (
          <React.Fragment key={indexOfFirst + idx}>
            <tr className="border-t border-gray-800 hover:bg-gray-800 transition">
              <td className="px-6 py-4 text-sm">{indexOfFirst + idx + 1}</td>
              <td className="px-6 py-4 text-sm">
                <Link
                  to={`/problems/${s.problemId}`}
                  className="text-blue-400 hover:underline"
                >
                  <ProblemName problemId={s.problemId} />
                </Link>
              </td>
              <td className="px-6 py-4 text-sm capitalize">{s.language}</td>
              <td
                className={`px-6 py-4 text-sm font-semibold ${
                  verdictColors[s.status] || "text-gray-300"
                }`}
              >
                {s.status}
              </td>
              <td className="px-6 py-4 text-sm text-gray-400 flex gap-1 items-center">
                <FaClock />
                {new Date(s.submittedAt).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => toggleRow(indexOfFirst + idx)}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  {expandedRows[indexOfFirst + idx] ? (
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
            {expandedRows[indexOfFirst + idx] && (
              <tr>
                <td colSpan={6} className="p-3 bg-gray-900">
                  <pre className="whitespace-pre-wrap text-sm text-gray-200 bg-gray-800 rounded p-2 overflow-x-auto">
                    {s.code}
                  </pre>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
);

const AllSubmissionsPage = () => {
  const { authUser: user, isLoading, isError } = useAuthUser();

  const [expandedRows, setExpandedRows] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 15;

  if (isLoading) return <SkeletonLoader />;
  if (isError || !user) return <ErrorMessage />;

  const submissions = user.submissions?.slice().reverse() || [];
  const totalPages = Math.ceil(submissions.length / submissionsPerPage);

  const indexOfLast = currentPage * submissionsPerPage;
  const indexOfFirst = indexOfLast - submissionsPerPage;
  const currentSubmissions = submissions.slice(indexOfFirst, indexOfLast);

  const toggleRow = (idx) => {
    setExpandedRows((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6 text-center text-blue-400">
          📄 Your Submissions
        </h1>

        {submissions.length === 0 ? (
          <p className="text-center text-gray-400">No submissions yet.</p>
        ) : (
          <>
            <SubmissionsTable
              submissions={currentSubmissions}
              expandedRows={expandedRows}
              toggleRow={toggleRow}
              indexOfFirst={indexOfFirst}
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
