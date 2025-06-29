import { Link } from "react-router-dom";
import { FaTwitter, FaYoutube, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer footer-horizontal footer-center bg-base-200 text-base-content rounded p-10">
      
      <nav className="grid grid-flow-col gap-4">
        <Link
          to="/about"
          className="link link-hover hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-500 
        focus:outline-none"
        >
          About us
        </Link>
        <Link
          to="/contact"
          className="link link-hover hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-500 
        focus:outline-none"
        >
          Contact
        </Link>
        <Link
          to="/courses"
          className="link link-hover hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-500 
        focus:outline-none"
        >
          Courses
        </Link>
        <Link
          to="/problems"
          className="link link-hover hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-500 
        focus:outline-none"
        >
          Problems
        </Link>
      </nav>

      <nav>
        <div className="grid grid-flow-col gap-6 text-2xl">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition duration-300"
          >
            <FaTwitter />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-500 transition duration-300"
          >
            <FaYoutube />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition duration-300"
          >
            <FaFacebook />
          </a>
        </div>
      </nav>

      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - All rights reserved by
          <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 px-0.5">
            CodeX
          </span>
        </p>
      </aside>

    </footer>
  );
};

export default Footer;
