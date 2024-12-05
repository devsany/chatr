import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-blue-500 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo or Brand Name */}
        <div className="text-lg font-bold">MyApp</div>

        {/* Menu Button (visible on small screens) */}
        <button
          className="lg:hidden text-white p-2 focus:outline-none hover:text-blue-300"
          onClick={toggleMenu}
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
            <div className="text-lg font-bold py-4 px-6  border-blue-700">
              MyApp
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
          <li className="border-b border-blue-700 lg:border-none">
            <NavLink
              to="/login"
              className="block py-4 px-6 text-lg hover:bg-blue-600 lg:hover:bg-transparent lg:hover:text-blue-300"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </NavLink>
          </li>
          <li className="border-b border-blue-700 lg:border-none">
            <NavLink
              to="/settings"
              className="block py-4 px-6 text-lg hover:bg-blue-600 lg:hover:bg-transparent lg:hover:text-blue-300"
              onClick={() => setMenuOpen(false)}
            >
              Settings
            </NavLink>
          </li>
          <li className="border-b border-blue-700 lg:border-none">
            <NavLink
              to="/add-friends"
              className="block py-4 px-6 text-lg hover:bg-blue-600 lg:hover:bg-transparent lg:hover:text-blue-300"
              onClick={() => setMenuOpen(false)}
            >
              Share
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
