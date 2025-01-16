import React, { useState } from "react";

const AutoComplete = ({ suggestions, onSelect }) => {
  const [query, setQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value) {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSelect(suggestion); // Gọi hàm callback onSelect và truyền giá trị đã chọn
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      setQuery(filteredSuggestions[activeSuggestionIndex]);
      setShowSuggestions(false);
      onSelect(filteredSuggestions[activeSuggestionIndex]); // Gọi hàm callback khi nhấn Enter
    } else if (e.keyCode === 38) {
      if (activeSuggestionIndex > 0) {
        setActiveSuggestionIndex(activeSuggestionIndex - 1);
      }
    } else if (e.keyCode === 40) {
      if (activeSuggestionIndex < filteredSuggestions.length - 1) {
        setActiveSuggestionIndex(activeSuggestionIndex + 1);
      }
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        className="w-full border border-gray-300 rounded-md p-2"
        placeholder="Search..."
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`px-4 py-2 cursor-pointer ${
                index === activeSuggestionIndex
                  ? "bg-blue-100"
                  : "hover:bg-blue-100"
              }`}
              onClick={() => handleClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      {showSuggestions && filteredSuggestions.length === 0 && (
        <div className="absolute w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 p-2 text-gray-500">
          No suggestions found
        </div>
      )}
    </div>
  );
};

export default AutoComplete;
