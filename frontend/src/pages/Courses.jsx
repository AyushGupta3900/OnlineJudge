import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ExploreCourses = () => {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/data.json");
        const data = await res.json();
        setCourses(data.courses);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, []);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  return (
    <div className="bg-gray-950 text-white min-h-screen px-6 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          📚 Explore Courses
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Structured learning paths designed to help you master DSA and system
          design — one step at a time.
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {currentCourses.map((course) => (
          <Link
            key={course.id}
            to={course.link}
            className="bg-gradient-to-tr from-gray-800 to-gray-900 border border-gray-700 p-6 rounded-2xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group relative"
          >
            <div className="text-5xl mb-4 text-blue-500 group-hover:rotate-3 transition-transform duration-300">
              {course.icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {course.title}
            </h3>
            <p className="text-gray-300 mb-4 line-clamp-3">
              {course.description}
            </p>
            <span className="inline-block px-3 py-1 text-sm bg-blue-600/80 backdrop-blur-md rounded-full text-white shadow-md">
              {course.difficulty}
            </span>

            {/* Glow border effect */}
            <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-blue-500 transition-all duration-300"></div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition border shadow-md hover:scale-105 duration-200 ${
                currentPage === index + 1
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:cursor-pointer"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreCourses;
