import { Link } from "react-router-dom";

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
                  to="/explore"
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
                to="https://facebook.com"
                target="_blank"
                className="text-gray-300 hover:text-blue-500 transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 2.5C18 1.67157 17.3284 1 16.5 1C15.6716 1 15 1.67157 15 2.5V7H12V5H15V3.5C15 2.67157 15.6716 2 16.5 2C17.3284 2 18 2.67157 18 3.5V7H20V9H18V17C18 17.8284 17.3284 18.5 16.5 18.5C15.6716 18.5 15 17.8284 15 17V9H12V11H15V17C15 18.3284 15.6716 19 16.5 19C17.3284 19 18 18.3284 18 17V9H20V7H18V2.5Z"
                  />
                </svg>
              </Link>
              <Link
                to="https://twitter.com"
                target="_blank"
                className="text-gray-300 hover:text-blue-400 transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M22 5.5c-0.76 1.02-1.77 1.9-2.9 2.47C18.24 6.88 17.12 5.5 15.5 5.5c-1.93 0-3.5 1.57-3.5 3.5 0 0.27 0.03 0.53 0.08 0.78C9.12 9.62 7.68 8 6 8c-1.68 0-3 1.32-3 3s1.32 3 3 3c0.62 0 1.2-0.22 1.65-0.57 0.53 2.35 2.46 4.13 4.89 4.19-1.8 1.41-4.08 2.26-6.49 2.26-0.42 0-0.83-0.02-1.25-0.07 2.27 1.45 5.04 2.3 7.94 2.3 9.53 0 14.75-7.9 14.75-14.75 0-0.22-0.01-0.43-0.02-0.65 1.02-0.74 1.9-1.66 2.6-2.7z"
                  />
                </svg>
              </Link>
              <Link
                to="https://instagram.com"
                target="_blank"
                className="text-gray-300 hover:text-pink-500 transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 2H8C6.34 2 5 3.34 5 5v14c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3zM8 0h8c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V4c0-2.21 1.79-4 4-4zM12 6c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm6 1c0.55 0 1-0.45 1-1s-0.45-1-1-1-1 0.45-1 1 0.45 1 1 1z"
                  />
                </svg>
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
