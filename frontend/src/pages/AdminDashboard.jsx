import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaUsers } from "react-icons/fa";
import {
  useGetAllProblemsQuery,
  useDeleteProblemMutation,
} from "../redux/api/problemAPI";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const AdminDashboard = () => {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetAllProblemsQuery();

  const [deleteProblem] = useDeleteProblemMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 10;

  const problems = data?.data || [];
  const indexOfLast = currentPage * problemsPerPage;
  const indexOfFirst = indexOfLast - problemsPerPage;
  const currentProblems = problems.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(problems.length / problemsPerPage);

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      background: "#1f2937",
      color: "#f3f4f6",
    });

    if (result.isConfirmed) {
      try {
        await deleteProblem(id).unwrap();
        refetch();
        toast.success("Problem deleted successfully");
      } catch (error) {
        if (error.status === 403) {
          toast.error("You are unauthorized to delete this problem");
        } else {
          toast.error("Failed to delete the problem");
        }
        console.error("Failed to delete:", error);
      }
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Link
              to="/admin/users"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-md transition"
            >
              <FaUsers />
              View Users
            </Link>
            <Link
              to="/admin/add-problem"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md transition"
            >
              <FaPlus />
              Add Problem
            </Link>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-md h-12 w-full"
              ></div>
            ))}
          </div>
        ) : isError ? (
          <p className="text-red-500">Failed to load problems.</p>
        ) : (
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-md overflow-x-auto">
              <table className="w-full table-auto text-left">
                <thead className="bg-gray-800 text-gray-300 text-sm uppercase tracking-wide">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Difficulty</th>
                    <th className="px-6 py-4">Tags</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProblems.map((problem) => (
                    <tr
                      key={problem._id}
                      className="border-t border-gray-800 hover:bg-gray-800 transition"
                    >
                      <td className="px-6 py-4">{problem.title}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            problem.difficulty === "Easy"
                              ? "bg-green-700 text-green-200"
                              : problem.difficulty === "Medium"
                              ? "bg-yellow-700 text-yellow-200"
                              : "bg-red-700 text-red-200"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          {problem.tags?.map((tag, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-700 px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 flex justify-center gap-4 text-lg">
                        <Link
                          to={`/admin/edit-problem/${problem._id}`}
                          className="text-blue-400 hover:text-blue-300 cursor-pointer"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(problem._id)}
                          className="text-red-500 hover:text-red-400 cursor-pointer"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {problems.length === 0 && (
                <p className="text-center py-8 text-gray-400">
                  No problems found.
                </p>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 gap-2 flex-wrap">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded cursor-pointer ${
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
