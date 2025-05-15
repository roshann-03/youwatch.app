import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaGithub,
  FaLinkedin,
  FaLinkedinIn,
} from "react-icons/fa"; // Import the icons

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 dark:bg-gray-900 text-gray-100 dark:text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Section 1: Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-amber-500 transition duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-amber-500 transition duration-300"
                >
                  Explore
                </Link>
              </li>
              <li>
                <Link
                  to="/my-videos"
                  className="hover:text-amber-500 transition duration-300"
                >
                  My Videos
                </Link>
              </li>
              <li>
                <Link
                  to="/upload"
                  className="hover:text-amber-500 transition duration-300"
                >
                  Upload Video
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 2: About Us */}
          <div>
            <h4 className="text-xl font-semibold mb-4">About Us</h4>
            <p className="text-sm">
              YouWatch is a platform where you can explore, upload, and share
              amazing videos with the world. Join our community and share your
              creative content today!
            </p>
          </div>

          {/* Section 3: Social Media */}
          <div>
            <h4 className="text-xl font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <Link
                to="https://github.com/roshann-03"
                target="_blank"
                className="text-gray-300 hover:text-gray-500 transition duration-300"
              >
                <FaGithub size={24} /> {/* Facebook icon */}
              </Link>
              <Link
                to="https://www.linkedin.com/in/roshan-shaikh-7a5428342/"
                target="_blank"
                className="text-gray-300 hover:text-sky-400 transition duration-300"
              >
                <FaLinkedinIn size={24} /> {/* Twitter icon */}
              </Link>
              <Link
                to="https://www.instagram.com/roshanshaikh.developer/"
                target="_blank"
                className="text-gray-300 hover:text-pink-500 transition duration-300"
              >
                <FaInstagram size={24} /> {/* Instagram icon */}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} YouWatch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
