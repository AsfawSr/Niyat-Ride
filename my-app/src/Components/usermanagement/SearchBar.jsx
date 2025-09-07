import React, { useState, useEffect } from "react";
const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(searchTerm.trim()); // call parent dispatch
    }, 500); // wait 500ms
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, onSearch]);
  return (
    <div className="flex justify-between m-4  items-center">
      <input
        type="text"
        placeholder="Search by ID, Name, Email, Role, or Status..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border rounded w-1/2 bg-white text-gray-700 placeholder-gray-400 
                   dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 dark:border-gray-600"
      />
    </div>
  );
};

export default SearchBar;
