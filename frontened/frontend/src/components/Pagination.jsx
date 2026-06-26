function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-10">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-900 dark:hover:bg-yellow-400 hover:text-white dark:hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-700 transition-colors duration-200"
      >
        ← Prev
      </button>

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 border ${
            page === index + 1
              ? "bg-gray-900 dark:bg-yellow-400 text-white dark:text-gray-900 border-gray-900 dark:border-yellow-400"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-900 dark:hover:bg-yellow-400 hover:text-white dark:hover:text-gray-900 border-gray-200 dark:border-gray-700"
          }`}
        >
          {index + 1}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-900 dark:hover:bg-yellow-400 hover:text-white dark:hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-700 transition-colors duration-200"
      >
        Next →
      </button>
    </div>
  );
}

export default Pagination;