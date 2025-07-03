import React, { useState } from "react";
import { useGetAllUsersQuery } from "../../redux/api/authAPI.js";
import { FaMedal } from "react-icons/fa";
import AdminPagination from "../../components/AdminPagination.jsx";

const medalColors = ["text-yellow-400", "text-gray-300", "text-orange-400"];

const TopThree = ({ users }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
    {users.map((user, index) => (
      <div
        key={user._id}
        className="bg-gray-900 rounded-xl shadow-lg p-4 flex flex-col items-center justify-center gap-2"
      >
        <FaMedal className={`text-4xl ${medalColors[index]}`} />
        <h2 className="text-xl font-bold">
          {user.fullName || user.username}
        </h2>
        <p className="text-sm text-gray-400">{user.email}</p>
        <p className="text-lg font-semibold text-blue-400">
          Rating: {user.computedRating ?? "N/A"}
        </p>
        <p className="text-sm text-green-400">
          Solved: {user.solvedProblems?.length || 0}
        </p>
      </div>
    ))}
  </div>
);

const LeaderboardTable = ({ users, startRank }) => {
  if (!users.length) {
    return (
      <p className="text-center py-8 text-gray-400">
        No more users found.
      </p>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-md overflow-x-auto">
      <table className="w-full table-auto text-left">
        <thead className="bg-gray-800 text-gray-300 text-sm uppercase tracking-wide">
          <tr>
            <th className="px-6 py-4">Rank</th>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Solved</th>
            <th className="px-6 py-4">Rating</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr
              key={user._id}
              className="border-t border-gray-800 hover:bg-gray-800 transition"
            >
              <td className="px-6 py-4 font-semibold text-gray-400">
                #{startRank + idx}
              </td>
              <td className="px-6 py-4">
                {user.fullName || user.username}
              </td>
              <td className="px-6 py-4 text-gray-400">{user.email}</td>
              <td className="px-6 py-4">
                {user.solvedProblems?.length || 0}
              </td>
              <td className="px-6 py-4 font-bold text-blue-400">
                {user.computedRating ?? "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Leaderboard = () => {
  const { data, isLoading, isError } = useGetAllUsersQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;

  const users = data?.data || [];

  const sortedUsers = [...users].sort(
    (a, b) => (b.computedRating || 0) - (a.computedRating || 0)
  );

  const topThree = sortedUsers.slice(0, 3);
  const others = sortedUsers.slice(3);

  const totalPages = Math.ceil(others.length / usersPerPage);
  const indexOfFirst = (currentPage - 1) * usersPerPage;
  const currentUsers = others.slice(indexOfFirst, indexOfFirst + usersPerPage);

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-yellow-400">
          🚀 Leaderboard
        </h1>

        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-md h-12 w-full"></div>
            ))}
          </div>
        ) : isError ? (
          <p className="text-red-500 text-center">
            Failed to load leaderboard.
          </p>
        ) : (
          <>
            <TopThree users={topThree} />
            <LeaderboardTable
              users={currentUsers}
              startRank={indexOfFirst + 4}
            />
            <AdminPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;