import React, { useState } from "react";
import { FiBell, FiUser } from "react-icons/fi";
import { NavLink } from "react-router-dom";

export default function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="h-14 border-b border-gray-300 px-18 flex items-center justify-end sticky top-0 -mt-2 bg-gray-200 dark:bg-gray-900">
      {/* Notifications */}
      <button className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors mr-4">
        <FiBell className="text-gray-700 dark:text-gray-200" size={20} />
      </button>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={toggleMenu}
          className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors"
        >
          <FiUser className="text-gray-700 dark:text-gray-200" size={20} />
        </button>

        {menuOpen && (
          <div className="absolute right-0- mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
            <NavLink
              to="/profile"
              onClick={closeMenu}
              className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Profile
            </NavLink>
            <div className="border-t border-gray-200 dark:border-gray-700"></div>
            <NavLink
              to="/logout"
              onClick={closeMenu}
              className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Logout
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
}
