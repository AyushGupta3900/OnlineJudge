import { useState } from "react";
import { FaLaptopCode } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useLogout from "../hooks/useLogout.js";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useLogout();

  const authUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAdmin = authUser?.role === "admin";

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const gradientLink =
    "hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-500 transition duration-300";

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/90 border-b border-gray-800 shadow-md px-4 py-3">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className={`text-2xl font-extrabold tracking-tight uppercase text-white ${gradientLink} flex items-center gap-2`}
        >
          <FaLaptopCode className="text-3xl text-blue-500" />
          CodeX
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/problems" className={`text-white text-base font-medium ${gradientLink}`}>
            Problems
          </Link>
          <Link to="/courses" className={`text-white text-base font-medium ${gradientLink}`}>
            Courses
          </Link>
          {isAuthenticated && (
            <Link to="/profile" className={`text-white text-base font-medium ${gradientLink}`}>
              Profile
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className={`text-white text-base font-medium ${gradientLink}`}>
              Admin Dashboard
            </Link>
          )}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-4 py-1.5 border border-white text-white rounded-md hover:bg-blue-600 transition cursor-pointer"
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button
            className="text-white text-2xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-16 right-4 bg-gray-800 border border-gray-700 rounded-xl shadow-xl w-56 py-4 z-50 transition-all duration-300">
          <ul className="flex flex-col gap-3 px-4 text-white font-medium">
            <li>
              <Link
                to="/problems"
                onClick={() => setIsOpen(false)}
                className={`${gradientLink}`}
              >
                Problems
              </Link>
            </li>
            <li>
              <Link
                to="/courses"
                onClick={() => setIsOpen(false)}
                className={`${gradientLink}`}
              >
                Courses
              </Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className={`${gradientLink}`}
                >
                  Profile
                </Link>
              </li>
            )}
            {isAdmin && (
              <li>
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className={`${gradientLink}`}
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
            <li className="pt-2">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full py-2 border border-white rounded-md text-white hover:bg-blue-600 transition"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full block text-center py-2 bg-blue-600 rounded-md text-white hover:bg-blue-500 transition"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Nav;
