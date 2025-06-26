import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

const LoggedOutNav = () => {
  return (
    <nav className="dark:bg-[#0a0f1c] bg-white border-b dark:border-[#1f2937] border-gray-200 shadow-lg px-6 py-4 flex justify-between items-center">
      {/* Logo + Name */}
      <Link to="/" className="flex items-center gap-3">
        {/* Logo */}
        <div className="h-10 w-14 rounded-lg overflow-hidden">
          <img
            src="/logo.jpg"
            alt="YouWatch Logo"
            className="h-full w-full dark:hidden object-cover rounded-lg"
          />
          <img
            src="/logo-dark.jpg"
            alt="YouWatch Logo"
            className="h-full w-full object-cover rounded-lg"
          />
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold tracking-wide font-futuristic text-gray-800 dark:text-[#00FFF7]">
          YouWatch
        </h1>
      </Link>

      {/* Theme Toggle */}
      <ThemeToggle />
    </nav>
  );
};

export default LoggedOutNav;
