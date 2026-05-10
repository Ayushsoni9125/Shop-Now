function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-10">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-yellow-400 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        ← Prev
      </button>

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => onPageChange(index + 1)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
            page === index + 1
              ? "bg-yellow-400 text-gray-900"
              : "bg-gray-200 text-gray-700 hover:bg-yellow-400 hover:text-gray-900"
          }`}
        >
          {index + 1}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-yellow-400 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        Next →
      </button>
    </div>
  );
}

export default Pagination;