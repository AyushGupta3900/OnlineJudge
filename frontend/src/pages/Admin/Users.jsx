import React, { useState } from "react";
import {
  useGetAllUsersQuery,
  useMakeAdminMutation,
} from "../../redux/api/userAPI.js";
import AdminPagination from "../../components/AdminPagination.jsx";
import PageHeader from "../../components/PageHeader.jsx";

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const usersPerPage = 10;

  const { data, isLoading, isFetching, isError, refetch } =
    useGetAllUsersQuery({
      page: currentPage,
      limit: usersPerPage,
      sortBy: "rating",
      order: "desc",
      search: searchTerm,
    });

  const [makeUserAdmin, { isLoading: isPromoting }] = useMakeAdminMutation();

  const users = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handleMakeAdmin = async (id) => {
    try {
      await makeUserAdmin(id).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to promote user:", err);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const heading = "All Users";

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <PageHeader heading={heading} />

        <div className="flex justify-end">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-gray-800 text-white px-4 py-2 rounded-md w-full max-w-xs placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {isError ? (
          <p className="text-red-500">Failed to fetch users.</p>
        ) : isLoading || isFetching ? (
          <TableSkeleton rows={usersPerPage} />
        ) : (
          <>
            <UsersTable
              users={users}
              isPromoting={isPromoting}
              onMakeAdmin={handleMakeAdmin}
            />

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

// 📌 Table
const UsersTable = ({ users, isPromoting, onMakeAdmin }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-md overflow-x-auto">
    {users.length === 0 ? (
      <p className="text-center py-8 text-gray-400">No users found.</p>
    ) : (
      <table className="w-full table-auto text-left">
        <thead className="bg-gray-800 text-gray-300 text-sm uppercase tracking-wide">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Solved</th>
            <th className="px-6 py-4">Rating</th>
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="border-t border-gray-800 hover:bg-gray-800 transition"
            >
              <td className="px-6 py-4">{user.fullName || user.username}</td>
              <td className="px-6 py-4 text-gray-400">{user.email}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    user.role === "admin"
                      ? "bg-purple-700 text-purple-200"
                      : "bg-blue-700 text-blue-200"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4">{user.solvedProblems?.length || 0}</td>
              <td className="px-6 py-4">{user.computedRating ?? "N/A"}</td>
              <td className="px-6 py-4">
                {user.role !== "admin" && (
                  <button
                    onClick={() => onMakeAdmin(user._id)}
                    disabled={isPromoting}
                    className="text-sm px-3 py-1 bg-green-600 hover:bg-green-500 rounded-md transition cursor-pointer"
                  >
                    {isPromoting ? "Promoting..." : "Make Admin"}
                  </button>
                )}
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
          <th className="px-6 py-4">Name</th>
          <th className="px-6 py-4">Email</th>
          <th className="px-6 py-4">Role</th>
          <th className="px-6 py-4">Solved</th>
          <th className="px-6 py-4">Rating</th>
          <th className="px-6 py-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, idx) => (
          <tr key={idx} className="border-t border-gray-800">
            <td className="px-6 py-6">
              <div className="h-4 w-24 bg-gray-700 rounded"></div>
            </td>
            <td className="px-6 py-6">
              <div className="h-4 w-32 bg-gray-700 rounded"></div>
            </td>
            <td className="px-6 py-6">
              <div className="h-4 w-16 bg-gray-700 rounded"></div>
            </td>
            <td className="px-6 py-6">
              <div className="h-4 w-12 bg-gray-700 rounded"></div>
            </td>
            <td className="px-6 py-6">
              <div className="h-4 w-12 bg-gray-700 rounded"></div>
            </td>
            <td className="px-6 py-6">
              <div className="h-6 w-24 bg-gray-700 rounded"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Users;
