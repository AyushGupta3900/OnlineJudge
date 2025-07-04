import React, { useState } from "react";
import { useGetContactMessagesQuery } from "../../redux/api/contactAPI.js";
import AdminPagination from "../../components/AdminPagination.jsx";
import PageHeader from "../../components/PageHeader.jsx";

const ContactMessages = () => {
  const { data, isLoading, isError, refetch } = useGetContactMessagesQuery();

  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;

  const messages = data?.data || [];
  const totalPages = Math.ceil(messages.length / messagesPerPage);

  const currentMessages = messages.slice(
    (currentPage - 1) * messagesPerPage,
    currentPage * messagesPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const heading = "Contact Messages";

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <PageHeader heading={heading} />

        {isLoading ? (
          <SkeletonLoader />
        ) : isError ? (
          <p className="text-red-500">Failed to fetch contact messages.</p>
        ) : (
          <>
            <MessagesTable messages={currentMessages} />

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
              <td className="px-6 py-4 text-gray-300 max-w-xs truncate" title={msg.message}>
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
const SkeletonLoader = () => (
  <div className="space-y-4 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-gray-800 rounded-md h-12 w-full"></div>
    ))}
  </div>
);

export default ContactMessages;
