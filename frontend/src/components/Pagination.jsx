import { motion } from "framer-motion";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-12 flex justify-center gap-2 flex-wrap"
    >
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`px-4 py-2 rounded-full font-medium text-sm transition border shadow-md hover:scale-105 duration-200 ${
            currentPage === index + 1
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:cursor-pointer"
          }`}
        >
          {index + 1}
        </button>
      ))}
    </motion.div>
  );
};

export default Pagination
