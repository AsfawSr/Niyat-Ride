import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  rowsPerPage,
  setRowsPerPage,
  onPageChange,
}) => {
  return (
    <div className="flex justify-between   mt-4 text-gray-700 dark:text-gray-200">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded disabled:opacity-50 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        Previous
      </button>
      <span className="px-2 text-gray-700 dark:text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      <select
        value={rowsPerPage}
        onChange={(e) => setRowsPerPage(Number(e.target.value))}
        className="p-2 border rounded bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
      >
        <option value={3}>3 rows</option>
        <option value={5}>5 rows</option>
        <option value={10}>10 rows</option>
      </select>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        Next
      </button>
      {/* Rows per page Select */}
    </div>
  );
};

export default Pagination;
