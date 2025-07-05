import React, { useState } from "react";
import { useGetAllUsersQuery } from "../../redux/api/authAPI.js";
import { FaMedal } from "react-icons/fa";
import AdminPagination from "../../components/AdminPagination.jsx";
import PageHeader from "../../components/PageHeader.jsx";

const medalColors = ["text-yellow-400", "text-gray-300", "text-orange-400"];

const TopThree = ({ users }) => {
  if (!users.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
      {users.map((user, index) => (
        <div
          key={user._id}
          className="bg-gray-900 rounded-xl shadow-lg p-4 flex flex-col items-center justify-center gap-2"
        >
          <FaMedal className={`text-4xl ${medalColors[index]}`} />
          <h2 className="text-xl font-bold">
            {user.fullName || user.username || "Unknown"}
          </h2>
          <p className="text-sm text-gray-400">{user.email || "No email"}</p>
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
};

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
                {user.fullName || user.username || "Unknown"}
              </td>
              <td className="px-6 py-4 text-gray-400">{user.email || "N/A"}</td>
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

  const users = Array.isArray(data?.data) ? data.data : [];

  const sortedUsers = [...users].sort(
    (a, b) => Number(b.computedRating || 0) - Number(a.computedRating || 0)
  );

  const topThree = sortedUsers.slice(0, 3);
  const others = sortedUsers.slice(3);

  const totalPages = Math.max(1, Math.ceil(others.length / usersPerPage));
  const indexOfFirst = (currentPage - 1) * usersPerPage;
  const currentUsers = others.slice(indexOfFirst, indexOfFirst + usersPerPage);

  const heading = "Leaderboard";

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader heading={heading} />

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
        ) : users.length === 0 ? (
          <p className="text-center text-gray-400">
            No users found.
          </p>
        ) : (
          <>
            <TopThree users={topThree} />
            <LeaderboardTable
              users={currentUsers}
              startRank={indexOfFirst + 4}
            />
            {totalPages > 1 && (
              <AdminPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
