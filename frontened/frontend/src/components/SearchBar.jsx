import { useState } from "react";

function SearchBar({ onSearch }) {
  const [input, setInput] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    onSearch(input.trim());
  };

  const clearHandler = () => {
    setInput("");
    onSearch("");
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex items-center gap-2 max-w-xl mx-auto"
    >
      {/* Input */}
      <div className="relative flex-1">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search for products..."
          className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        {/* Clear button */}
        {input && (
          <button
            type="button"
            onClick={clearHandler}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="bg-gray-900 dark:bg-yellow-400 text-white dark:text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-yellow-300 transition-all duration-200"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;