import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { AppContext } from "./context";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { login, logout, isAuthenticated } = useContext(AppContext);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-blue-500 text-white shadow-lg sticky top-0 z-50">
      <div className="container w-[75vw] mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo or Brand Name */}
        <div className="text-lg font-bold">
          <img className="w-[100px] rounded-md" src="/mainlogo3.png" alt="" />
        </div>

        {/* Menu Button (visible on small screens) */}
        <button
          className="lg:hidden text-white p-2 focus:outline-none hover:text-blue-300"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
        </button>

        {/* Navbar Links */}
        <ul
          className={`fixed inset-y-0 left-0 bg-blue-500 w-3/4 max-w-sm transform transition-transform duration-300 ease-in-out 
            ${
              menuOpen ? "translate-x-0" : "-translate-x-full"
            } lg:relative lg:translate-x-0 lg:flex lg:space-x-6 lg:w-auto lg:bg-transparent`}
        >
          {/* Small Screen Logo */}
          {menuOpen && (
            <div className="text-lg font-bold py-4 px-6 border-b border-blue-700">
              <img
                className="w-[100px] rounded-md"
                src="/mainlogo3.png"
                alt=""
              />
            </div>
          )}
          <li className="border-b border-blue-700 lg:border-none">
            <NavLink
              to="/"
              className="block py-4 px-6 text-lg hover:bg-blue-600 lg:hover:bg-transparent lg:hover:text-blue-300"
              onClick={() => setMenuOpen(false)}
            >
              Registration
            </NavLink>
          </li>
          {/* <li className="border-b border-blue-700 lg:border-none">
            <NavLink
              to="/login"
              className="block py-4 px-6 text-lg hover:bg-blue-600 lg:hover:bg-transparent lg:hover:text-blue-300"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </NavLink>
          </li> */}
          <li className="border-b border-blue-700 lg:border-none">
            {isAuthenticated && (
              <NavLink
                to="/userList"
                className="block py-4 px-6 text-lg hover:bg-blue-600 lg:hover:bg-transparent lg:hover:text-blue-300"
                onClick={() => setMenuOpen(false)}
              >
                UserList
              </NavLink>
            )}
          </li>
          <li className="border-b border-blue-700 lg:border-none">
            {isAuthenticated && (
              <NavLink
                to="/dashboard"
                className="block py-4 px-6 text-lg hover:bg-blue-600 lg:hover:bg-transparent lg:hover:text-blue-300"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </NavLink>
            )}
          </li>
          <li className="border-b border-blue-700 lg:border-none">
            {isAuthenticated ? (
              <button
                className="block py-4 px-6 text-lg hover:bg-blue-600 lg:hover:bg-transparent lg:hover:text-blue-300"
                onClick={logout}
              >
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                className="block py-4 px-6 text-lg hover:bg-blue-600 lg:hover:bg-transparent lg:hover:text-blue-300"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </NavLink>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
