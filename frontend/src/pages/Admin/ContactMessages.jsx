import React, { useState } from "react";
import { useGetContactMessagesQuery } from "../../redux/api/contactAPI.js";
import AdminPagination from "../../components/AdminPagination.jsx";
import PageHeader from "../../components/PageHeader.jsx";

const ContactMessages = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const messagesPerPage = 10;

  const { data, isLoading, isFetching, isError } =
    useGetContactMessagesQuery({
      page: currentPage,
      limit: messagesPerPage,
      search: searchTerm,
    });

  const messages = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // reset to first page on search
  };

  const heading = "Contact Messages";

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <PageHeader heading={heading} />

        <div className="flex justify-end">
          <input
            type="text"
            placeholder="Search messages"
            value={searchTerm}
            onChange={handleSearchChange}
            className="bg-gray-800 text-white px-4 py-2 rounded-md w-full max-w-xs placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        {isError ? (
          <p className="text-red-500">Failed to fetch contact messages.</p>
        ) : isLoading || isFetching ? (
          <SkeletonLoader rows={messagesPerPage} />
        ) : (
          <>
            <MessagesTable messages={messages} />

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
const MessagesTable = ({ messages }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-md overflow-x-auto">
    {messages.length === 0 ? (
      <p className="text-center py-8 text-gray-400">No contact messages found.</p>
    ) : (
      <table className="w-full table-auto text-left">
        <thead className="bg-gray-800 text-gray-300 text-sm uppercase tracking-wide">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Message</th>
            <th className="px-6 py-4">Date</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => (
            <tr
              key={msg._id}
              className="border-t border-gray-800 hover:bg-gray-800 transition"
            >
              <td className="px-6 py-4">{msg.name}</td>
              <td className="px-6 py-4 text-blue-400">{msg.email}</td>
              <td
                className="px-6 py-4 text-gray-300 max-w-xs truncate"
                title={msg.message}
              >
                {msg.message}
              </td>
              <td className="px-6 py-4 text-gray-400">
                {new Date(msg.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);

// 📌 Skeleton Loader
const SkeletonLoader = ({ rows = 10 }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-md overflow-x-auto animate-pulse">
    <table className="w-full table-auto text-left">
      <thead className="bg-gray-800 text-gray-300 text-sm uppercase tracking-wide">
        <tr>
          <th className="px-6 py-4">Name</th>
          <th className="px-6 py-4">Email</th>
          <th className="px-6 py-4">Message</th>
          <th className="px-6 py-4">Date</th>
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
              <div className="h-4 w-48 bg-gray-700 rounded"></div>
            </td>
            <td className="px-6 py-6">
              <div className="h-4 w-24 bg-gray-700 rounded"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ContactMessages;
