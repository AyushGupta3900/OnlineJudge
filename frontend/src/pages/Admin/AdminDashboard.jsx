import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaUsers, FaEdit, FaTrash, FaEnvelope } from "react-icons/fa";
import {
  useGetAllProblemsQuery,
  useDeleteProblemMutation,
} from "../../redux/api/problemAPI";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AdminPagination from "../../components/AdminPagination";

const MySwal = withReactContent(Swal);

const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const problemsPerPage = 10;

  const { data, isLoading, isError, isFetching, refetch } =
    useGetAllProblemsQuery({
      page: currentPage,
      limit: problemsPerPage,
      search: searchTerm,
    });

  const [deleteProblem] = useDeleteProblemMutation();

  const problems = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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
        toast.success("Problem deleted successfully");
        refetch(); // refresh list
      } catch (err) {
        toast.error(
          err?.status === 403
            ? "You are unauthorized to delete this problem"
            : "Failed to delete the problem"
        );
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // reset page
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader />

        <div className="flex justify-end">
          <input
            type="text"
            placeholder="Search problems"
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-gray-800 text-white px-4 py-2 rounded-md w-full max-w-xs placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {isError ? (
          <p className="text-red-500">Failed to load problems.</p>
        ) : isLoading || isFetching ? (
          <TableSkeleton rows={problemsPerPage} />
        ) : (
          <>
            <ProblemsTable problems={problems} onDelete={handleDelete} />

            {totalPages > 1 && (
              <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

// 📌 Header
const DashboardHeader = () => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
      Admin Dashboard
    </h1>
    <div className="flex flex-wrap gap-4">
      <Link
        to="/admin/users"
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-md transition cursor-pointer"
      >
        <FaUsers /> View Users
      </Link>
      <Link
        to="/admin/contact-messages"
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md transition cursor-pointer"
      >
        <FaEnvelope /> View Contact Messages
      </Link>
      <Link
        to="/admin/add-problem"
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md transition cursor-pointer"
      >
        <FaPlus /> Add Problem
      </Link>
    </div>
  </div>
);

// 📌 Table
const ProblemsTable = ({ problems, onDelete }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-md overflow-x-auto">
    {problems.length === 0 ? (
      <p className="text-center py-8 text-gray-400">No problems found.</p>
    ) : (
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
          {problems.map((problem) => (
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
                  onClick={() => onDelete(problem._id)}
                  className="text-red-500 hover:text-red-400 cursor-pointer"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

// 📌 Skeleton Table
const TableSkeleton = ({ rows = 10 }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-md overflow-x-auto animate-pulse">
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
        {Array.from({ length: rows }).map((_, idx) => (
          <tr key={idx} className="border-t border-gray-800">
            <td className="px-6 py-6">
              <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
            </td>
            <td className="px-6 py-6">
              <div className="h-4 w-16 bg-gray-700 rounded"></div>
            </td>
            <td className="px-6 py-6">
              <div className="h-4 w-32 bg-gray-700 rounded"></div>
            </td>
            <td className="px-6 py-6 flex justify-center gap-4">
              <div className="h-6 w-6 bg-gray-700 rounded"></div>
              <div className="h-6 w-6 bg-gray-700 rounded"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default AdminDashboard;
