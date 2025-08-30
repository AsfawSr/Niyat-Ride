import React from "react";
import { NavLink } from "react-router-dom";

const SearchBar = ({ setSearchTerm, filter, rowsPerPage, setRowsPerPage }) => {
  return (
    <div className="flex justify-between mb-4 items-center">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by ID, Name, Email, Role, or Status..."
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border rounded w-1/2 bg-white text-gray-700 placeholder-gray-400 
                   dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 dark:border-gray-600"
      />
      {/* Rows per page Select */}
      {filter === "dispatchers" && (
        <button className="rounded bg-blue-500 text-white p-4">
          <NavLink to="/signup">Create dispatcher</NavLink>
        </button>
      )}
      <select
        value={rowsPerPage}
        onChange={(e) => setRowsPerPage(Number(e.target.value))}
        className="p-2 border rounded bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
      >
        <option value={3}>3 rows</option>
        <option value={5}>5 rows</option>
        <option value={10}>10 rows</option>
      </select>
    </div>
  );
};

export default SearchBar;
