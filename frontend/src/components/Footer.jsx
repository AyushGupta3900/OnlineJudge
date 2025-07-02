import { Link } from "react-router-dom";
import { FaTwitter, FaYoutube, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">

        {/* Navigation Links */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-2">Explore</h3>
          <ul className="space-y-2 text-sm">
            {[
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact" },
              { to: "/courses", label: "Courses" },
              { to: "/problems", label: "Problems" },
            ].map((link, i) => (
              <li key={i}>
                <Link
                  to={link.to}
                  className="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-500 transition duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-2">Follow Us</h3>
          <div className="flex justify-center md:justify-start gap-6 text-2xl">
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
        </div>

        {/* Branding & Copyright */}
        <div className="flex flex-col items-center md:items-end justify-between space-y-2">
          <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            CodeX
          </span>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} CodeX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
