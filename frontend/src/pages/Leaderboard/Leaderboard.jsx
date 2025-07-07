import React, { useState } from "react";
import { useGetLeaderboardQuery } from "../../redux/api/userAPI.js";
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
      <p className="text-center py-8 text-gray-400">No more users found.</p>
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
              <td className="px-6 py-4">{user.solvedProblems?.length || 0}</td>
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
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  const { data, isLoading, isFetching, isError } = useGetLeaderboardQuery({
    page: currentPage,
    limit: usersPerPage,
  });

  const heading = "Leaderboard";

  const topThree = data?.topThree || [];
  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader heading={heading} />

        {isLoading ? (
          <PageLoadingSkeleton />
        ) : isError ? (
          <p className="text-red-500 text-center">Failed to load leaderboard.</p>
        ) : !users.length && !topThree.length ? (
          <p className="text-center text-gray-400">No users found.</p>
        ) : (
          <>
            <TopThree users={topThree} />

            {isFetching ? (
              <LeaderboardTableSkeleton />
            ) : (
              <>
                <LeaderboardTable
                  users={users}
                  startRank={(currentPage - 1) * usersPerPage + 4}
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
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;

const PageLoadingSkeleton = () => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-800 rounded-xl h-32 w-full"
        ></div>
      ))}
    </div>

    <LeaderboardTableSkeleton />
  </>
);

const LeaderboardTableSkeleton = () => (
  <div className="space-y-2 animate-pulse">
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="bg-gray-800 rounded-md h-10 w-full"
      ></div>
    ))}
  </div>
);
