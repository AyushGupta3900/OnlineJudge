import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center px-6 py-16">
      <div className="text-center space-y-6 max-w-md">
        {/* Big 404 */}
        <h1 className="text-7xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-lg">
          404
        </h1>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-100">
          Page Not Found
        </h2>

        {/* Message */}
        <p className="text-gray-400 text-md">
          Oops! The page you're looking for doesn’t exist or might have been moved.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full shadow-md hover:scale-105 transition duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
