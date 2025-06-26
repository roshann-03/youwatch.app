import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-[#F8FAFC] dark:bg-[#0a0f1c] text-[#0f172a] dark:text-[#F1F5F9] py-10 border-t border-[#E5E7EB] dark:border-[#1f2937] font-sans dark:font-futuristic">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Section 1: Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-[#3A86FF] dark:text-[#00FFF7]">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-[#FF006E] dark:hover:text-[#FF00A8] transition duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="hover:text-[#FF006E] dark:hover:text-[#FF00A8] transition duration-300"
                >
                  Explore
                </Link>
              </li>
              <li>
                <Link
                  to="/my-videos"
                  className="hover:text-[#FF006E] dark:hover:text-[#FF00A8] transition duration-300"
                >
                  My Videos
                </Link>
              </li>
              <li>
                <Link
                  to="/upload"
                  className="hover:text-[#FF006E] dark:hover:text-[#FF00A8] transition duration-300"
                >
                  Upload Video
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 2: About Us */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-[#3A86FF] dark:text-[#00FFF7]">
              About Us
            </h4>
            <p className="text-sm text-[#475569] dark:text-[#94a3b8]">
              YouWatch is a platform where you can explore, upload, and share
              amazing videos with the world. Join our community and share your
              creative content today!
            </p>
          </div>

          {/* Section 3: Social Media */}
          <div>
            <h4 className="text-xl font-semibold mb-4 text-[#3A86FF] dark:text-[#00FFF7]">
              Follow Us
            </h4>
            <div className="flex gap-4">
              <Link
                to="https://github.com/roshann-03"
                target="_blank"
                className="text-[#0f172a] dark:text-[#F1F5F9] hover:text-[#3A86FF] dark:hover:text-[#00FFF7] transition duration-300"
              >
                <FaGithub size={24} />
              </Link>
              <Link
                to="https://www.linkedin.com/in/roshan-shaikh-7a5428342/"
                target="_blank"
                className="text-[#0f172a] dark:text-[#F1F5F9] hover:text-[#3A86FF] dark:hover:text-[#00FFF7] transition duration-300"
              >
                <FaLinkedinIn size={24} />
              </Link>
              <Link
                to="https://www.instagram.com/roshanshaikh.developer/"
                target="_blank"
                className="text-[#0f172a] dark:text-[#F1F5F9] hover:text-[#FF006E] dark:hover:text-[#FF00A8] transition duration-300"
              >
                <FaInstagram size={24} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[#E5E7EB] dark:border-[#1f2937] pt-4 text-center">
          <p className="text-sm text-[#475569] dark:text-[#94a3b8]">
            &copy; {new Date().getFullYear()} YouWatch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
