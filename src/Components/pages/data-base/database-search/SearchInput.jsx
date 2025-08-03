import React from "react";
import { FiChevronDown, FiX, FiSearch } from "react-icons/fi";

export const SearchInput = ({
  inputValue,
  onInputChange,
  onFocus,
  onKeyDown,
  onReset,
  t,
  toggleDropdown,
  isOpen,
  hasSelection,
}) => (
  <div className="relative">
    <input
      type="text"
      value={inputValue}
      onChange={onInputChange}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      placeholder={t("search_diseases_placeholder_key")}
      className="nav-input pe-20 p-2 "
    />
    <div className="absolute end-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
      {hasSelection ? (
        <button
          type="button"
          onClick={onReset}
          className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
          title={t("clear_selection", "Clear selection")}
        >
          <FiX className="w-4 h-4" />
        </button>
      ) : (
        <div className="absolute end-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2  p-1">
          <FiSearch className="w-4 h-4 text-gray-400" />
        </div>
      )}
      <button
        type="button"
        onClick={toggleDropdown}
        className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
      >
        <FiChevronDown
          className={`w-4 h-4 transition-transform cursor-pointer ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
    </div>
  </div>
);
