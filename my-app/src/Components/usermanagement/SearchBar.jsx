import React from "react";

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  rowsPerPage,
  setRowsPerPage,
}) => {
  return (
    <div className="flex justify-between mb-4 items-center">
      <input
        type="text"
        placeholder="Search by ID, Name, Email, Role, or Status..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border rounded w-1/2"
      />
      <select
        value={rowsPerPage}
        onChange={(e) => setRowsPerPage(Number(e.target.value))}
        className="p-2 border rounded"
      >
        <option value={3}>3 rows</option>
        <option value={5}>5 rows</option>
        <option value={10}>10 rows</option>
      </select>
    </div>
  );
};

export default SearchBar;
