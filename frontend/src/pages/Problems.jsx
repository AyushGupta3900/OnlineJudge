import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("table");

  const problemsPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/data.json");
        const data = await res.json();
        setProblems(data.problems);
      } catch (error) {
        console.error("Failed to load problems:", error);
      }
    };

    fetchData();
  }, []);

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

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen px-4 py-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-md">
          🧩 DSA Problems
        </h1>

        <button
          onClick={() => setViewMode(viewMode === "card" ? "table" : "card")}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white px-6 py-2 rounded-xl shadow-lg font-medium w-full md:w-auto"
        >
          Switch to {viewMode === "card" ? "Table" : "Card"} View
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
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
          className="bg-gray-800 text-white px-5 py-3 rounded-lg border border-gray-700 shadow-md"
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {viewMode === "card" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProblems.map((problem) => (
            <div
              key={problem.id}
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
                  {problem.status === "solved" ? "✅ Solved" : "🕒 Not Solved"}
                </span>
                <Link
                  to={`/problems/${problem.id}`}
                  className="text-blue-400 hover:underline text-sm"
                >
                  Solve →
                </Link>
              </div>
            </div>
          ))}
        </div>
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
              {currentProblems.map((problem) => (
                <tr
                  key={problem.id}
                  className="border-b border-gray-700 hover:bg-gray-700 transition"
                >
                  <td className="px-6 py-4">
                    <Link
                      to={`/problems/${problem.id}`}
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
              className={`px-4 py-2 rounded-full font-medium text-sm transition border shadow-md hover:scale-105 duration-200 ${
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
    </div>
  );
};

export default Problems;
