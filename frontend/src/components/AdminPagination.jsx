import React from 'react'

const AdminPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex justify-center">
      <div className="flex gap-2 flex-nowrap overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 px-2 py-1 rounded bg-gray-900 shadow-inner">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-50 cursor-pointer shrink-0"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded cursor-pointer shrink-0 ${
              page === currentPage
                ? "bg-blue-600 text-white"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-50 cursor-pointer shrink-0"
        >
          Next
        </button>
      </div>
    </div>
  );
};


export default AdminPagination
