import React, { useState } from "react";
import {
  useGetAllUsersQuery,
  useMakeUserAdminMutation,
} from "../../redux/api/authAPI.js";
import AdminPagination from "../../components/AdminPagination.jsx";
import PageHeader from "../../components/PageHeader.jsx";

const Users = () => {
  const { data, isLoading, isError, refetch } = useGetAllUsersQuery();
  const [makeUserAdmin, { isLoading: isPromoting }] =
    useMakeUserAdminMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const users = data?.data || [];
  const totalPages = Math.ceil(users.length / usersPerPage);

  const currentUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

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

  const heading = "All Users";

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <PageHeader heading={heading} />

        {isLoading ? (
          <SkeletonLoader />
        ) : isError ? (
          <p className="text-red-500">Failed to fetch users.</p>
        ) : (
          <>
            <UsersTable
              users={currentUsers}
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

// 📌 Table Component
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
              <td className="px-6 py-4">
                {user.fullName || user.username}
              </td>
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

// 📌 Skeleton Loader
const SkeletonLoader = () => (
  <div className="space-y-4 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-gray-800 rounded-md h-12 w-full"></div>
    ))}
  </div>
);

export default Users;
