import { useState } from "react";
import { Link } from "react-router-dom";
import { useGetAllProblemsQuery } from "../redux/api/problemAPI.js";
import useAuthUser from "../hooks/useAuthUser.js"; 
import { motion } from "framer-motion";

const Problems = () => {
  const { data, isLoading, isError } = useGetAllProblemsQuery();
  const problems = data?.data || [];
  const [search, setSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("card");

  const { authUser } = useAuthUser();
  const solvedProblemIds = authUser?.solvedProblems?.map((id) => id.toString()) || [];

  const problemsPerPage = 12;

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(search.toLowerCase()) ||
      problem.tags.some((tag) =>
        tag.toLowerCase().includes(search.toLowerCase())
      );

    const matchesDifficulty =
      selectedDifficulty === "" ||
      problem.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    return matchesSearch && matchesDifficulty;
  });

  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = filteredProblems.slice(
    indexOfFirstProblem,
    indexOfLastProblem
  );
  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);

  const markedProblems = currentProblems.map((problem) => ({
    ...problem,
    status: solvedProblemIds.includes(problem._id) ? "solved" : "unsolved",
  }));

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-md">
          🧙‍♂️ DSA Problems
        </h1>

        <button
          onClick={() => setViewMode(viewMode === "card" ? "table" : "card")}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white px-6 py-2 rounded-xl shadow-lg font-medium w-full md:w-auto cursor-pointer"
        >
          Switch to {viewMode === "card" ? "Table" : "Card"} View
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8"
      >
        <input
          type="text"
          placeholder="🔍 Search problems..."
          className="w-full md:w-1/2 px-5 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          value={selectedDifficulty}
          onChange={(e) => {
            setSelectedDifficulty(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-gray-800 text-white px-5 py-3 rounded-lg border border-gray-700 shadow-md cursor-pointer"
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </motion.div>

      {isLoading && (
        <div className="text-center text-blue-400 font-medium py-10">
          Loading problems...
        </div>
      )}

      {isError && (
        <div className="text-center text-red-500 font-medium py-10">
          Failed to fetch problems. Please try again later.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {viewMode === "card" ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { staggerChildren: 0.05 },
                },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {markedProblems.map((problem) => (
                <motion.div
                  key={problem._id}
                  variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 h-full flex flex-col justify-between min-h-[220px]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">
                        {problem.title}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium uppercase tracking-wide ${
                          problem.difficulty === "Easy"
                            ? "bg-green-600"
                            : problem.difficulty === "Medium"
                            ? "bg-yellow-500 text-black"
                            : "bg-red-600"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {problem.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-gray-700 text-sm px-3 py-1 rounded-full text-gray-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-auto">
                    <span
                      className={`text-sm font-medium ${
                        problem.status === "solved"
                          ? "text-green-400"
                          : "text-gray-400"
                      }`}
                    >
                      {problem.status === "solved"
                        ? "✅ Solved"
                        : "🕒 Not Solved"}
                    </span>
                    <Link
                      to={`/problems/${problem._id}`}
                      className="text-blue-400 hover:underline text-sm"
                    >
                      Solve →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="overflow-x-auto mt-4 bg-gray-800 rounded-xl shadow-xl">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-700 text-gray-300 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Problem</th>
                    <th className="px-6 py-4">Difficulty</th>
                    <th className="px-6 py-4">Tags</th>
                    <th className="px-6 py-4">Submissions</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {markedProblems.map((problem) => (
                    <tr
                      key={problem._id}
                      className="border-b border-gray-700 hover:bg-gray-700 transition"
                    >
                      <td className="px-6 py-4">
                        <Link
                          to={`/problems/${problem._id}`}
                          className="text-blue-400 hover:underline"
                        >
                          {problem.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            problem.difficulty === "Easy"
                              ? "bg-green-600"
                              : problem.difficulty === "Medium"
                              ? "bg-yellow-500 text-black"
                              : "bg-red-600"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {problem.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="bg-gray-600 text-gray-200 px-2 py-0.5 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {problem.submissions || "—"}
                      </td>
                      <td className="px-6 py-4">
                        {problem.status === "solved" ? "✅" : "⭕"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2 flex-wrap">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition border shadow-md hover:scale-105 duration-200 cursor-pointer ${
                    currentPage === index + 1
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Problems;
