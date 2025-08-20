import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center gap-3 mt-4 text-gray-700 dark:text-gray-200">
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

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
