// src/components/LoggedOutNav.js
import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
const LoggedOutNav = () => {
  return (
    <nav className="dark:bg-black shadow-lg  p-4 flex justify-between items-center">
      <div className="logo">
        <Link to="/">
          <div className="logo-container flex justify-center items-center">
            <div className="logo h-10 w-14 rounded-lg flex justify-center items-center object-center object-cover">
              <img
                src={`/logo.jpg`}
                alt=""
                className="h-full w-full rounded-lg"
              />
            </div>
            <h1 className="dark:text-white font-bold text-xl ml-2">YouWatch</h1>
          </div>
        </Link>
      </div>
      <ThemeToggle />
    </nav>
  );
};

export default LoggedOutNav;
