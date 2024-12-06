import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { AppContext } from "./context";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout, isAuthenticated } = useContext(AppContext);

  const navItems = [
    { label: "Home", to: "/", authRequired: false },
    { label: "User List", to: "/userList", authRequired: true },
    { label: "Dashboard", to: "/dashboard", authRequired: true },
  ];

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <img className=" w-24 rounded-md" src="/mainlogo3.png" alt="Logo" />
        </div>

        {/* Desktop Links */}
        <nav className="hidden lg:flex space-x-6">
          {navItems.map(
            (item) =>
              (!item.authRequired || isAuthenticated) && (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className="text-gray-700 hover:text-blue-500 transition duration-300"
                >
                  {item.label}
                </NavLink>
              )
          )}
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="text-gray-700 hover:text-red-500 transition duration-300"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="text-gray-700 hover:text-blue-500 transition duration-300"
            >
              Login
            </NavLink>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-gray-700 focus:outline-none"
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-100 shadow-lg transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden z-40`}
      >
        {/* Logo in Mobile Menu */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <img className="w-20 rounded-md" src="/mainlogo3.png" alt="Logo" />
        </div>

        <nav className="flex flex-col space-y-3  p-6">
          {navItems.map(
            (item) =>
              (!item.authRequired || isAuthenticated) && (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className="block hover:bg-white p-2 rounded-md hover:shadow-md text-gray-700 hover:text-blue-500 transition duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                  <hr />
                </NavLink>
              )
          )}
          {isAuthenticated ? (
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="block text-gray-700 hover:text-red-500 transition duration-300"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="block text-gray-700 hover:text-blue-500 transition duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </NavLink>
          )}
        </nav>
      </div>

      {/* Overlay to Close Menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 lg:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </header>
  );
}

export default Navbar;
