import React from "react";
import {
  useGetAllUsersQuery,
  useMakeUserAdminMutation,
} from "../../redux/api/authAPI.js";

const Users = () => {
  const { data, isLoading, isError, refetch } = useGetAllUsersQuery();
  const [makeUserAdmin, { isLoading: isPromoting }] =
    useMakeUserAdminMutation();

  const handleMakeAdmin = async (id) => {
    try {
      await makeUserAdmin(id).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to promote user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">All Users</h1>
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-md h-12 w-full"></div>
            ))}
          </div>
        ) : isError ? (
          <p className="text-red-500">Failed to fetch users.</p>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-md overflow-x-auto">
            <table className="w-full table-auto text-left">
              <thead className="bg-gray-800 text-gray-300 text-sm uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Problems Solved</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((user) => (
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
                    <td className="px-6 py-4">
                      {user.solvedProblems?.length || 0}
                    </td>
                    <td className="px-6 py-4">
                      {user.role !== "admin" && (
                        <button
                          onClick={() => handleMakeAdmin(user._id)}
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

            {data?.data?.length === 0 && (
              <p className="text-center py-8 text-gray-400">No users found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
