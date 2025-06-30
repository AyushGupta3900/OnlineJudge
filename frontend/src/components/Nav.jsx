import React, { useState } from "react";
import { FaLaptopCode } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser.js";
import { useLogoutUserMutation } from "../redux/api/authAPI.js";
import { useDispatch } from "react-redux";
import { logout as clearCredentials } from "../redux/reducers/authReducer.js";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { authUser } = useAuthUser();
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = Boolean(authUser);

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(clearCredentials());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const gradientHover =
    "hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-500 transition duration-300 bg-transparent focus:outline-none";

  return (
    <nav className="navbar sticky top-0 z-50 bg-base-100 shadow-sm px-4">
      <div className="flex-1">
        <Link
          to="/"
          className={`btn btn-ghost text-2xl font-extrabold tracking-tight uppercase cursor-pointer text-white ${gradientHover}`}
        >
          <span className="inline-flex items-center gap-2">
            <FaLaptopCode className="text-3xl text-blue-500" />
            CodeX
          </span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex flex-none items-center gap-4">
        <ul className="menu menu-horizontal px-1 text-lg font-medium tracking-wide bg-transparent">
          <li>
            <Link to="/problems" className={`cursor-pointer ${gradientHover}`}>
              Problems
            </Link>
          </li>
          <li>
            <details>
              <summary className={`cursor-pointer ${gradientHover}`}>
                Explore Courses
              </summary>
              <ul className="bg-base-100 rounded-t-none p-2 text-base font-normal">
                <li>
                  <Link to="/courses/" className={gradientHover}>
                    Data Structures
                  </Link>
                </li>
                <li>
                  <Link to="/courses/" className={gradientHover}>
                    Algorithms
                  </Link>
                </li>
                <li>
                  <Link to="/courses/" className={gradientHover}>
                    System Design
                  </Link>
                </li>
              </ul>
            </details>
          </li>
        </ul>

        {/* Navbar Button */}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="btn btn-sm btn-outline text-white border-white hover:bg-blue-600"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="btn btn-sm btn-primary text-white normal-case"
          >
            Login
          </Link>
        )}
      </div>

      {/* Hamburger Icon */}
      <div className="md:hidden">
        <button
          className="btn btn-ghost text-xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="absolute top-16 right-4 bg-base-100 shadow-md rounded-md w-52 z-50 md:hidden">
          <ul className="menu p-2 text-base font-medium bg-transparent">
            <li>
              <Link
                to="/problems"
                onClick={() => setIsOpen(false)}
                className={gradientHover}
              >
                Problems
              </Link>
            </li>
            <li>
              <details>
                <summary className={gradientHover}>Explore Courses</summary>
                <ul className="p-2 text-sm">
                  <li>
                    <Link
                      to="/courses/"
                      onClick={() => setIsOpen(false)}
                      className={gradientHover}
                    >
                      Data Structures
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/courses/"
                      onClick={() => setIsOpen(false)}
                      className={gradientHover}
                    >
                      Algorithms
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/courses/"
                      onClick={() => setIsOpen(false)}
                      className={gradientHover}
                    >
                      System Design
                    </Link>
                  </li>
                </ul>
              </details>
            </li>

            {/* Mobile Auth Button */}
            <li className="mt-2">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="btn btn-sm btn-outline w-full"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-sm btn-primary w-full text-white"
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
