import React, { useRef, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

// Custom hook to detect clicks outside the component
const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
};

const DropdownMenu = ({
  buttonRef,
  menuRef,
  isOpen,
  toggle,
  buttonContent,
  options,
  position = "left",
  buttonClassName = "",
  menuClassName = "",
  align = "start",
}) => {
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useClickOutside(dropdownRef, () => {
    if (isOpen) toggle();
  });

  // Handle option click
  const handleOptionClick = (option) => {
    option.onClick();
    toggle(); // Close menu after selection
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={toggle}
        className={`flex items-center gap-2 ${buttonClassName}`}
        type="button"
      >
        {buttonContent}
        {isOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
      </button>

      {isOpen && (
        <ul
          ref={menuRef}
          className={`absolute z-10 min-w-[160px] overflow-auto rounded-lg border border-slate-200 bg-white shadow-md mt-2 ${
            position === "right" ? "right-0" : "left-0"
          } ${
            align === "center" ? "left-1/2 transform -translate-x-1/2" : ""
          } ${menuClassName}`}
        >
          {options.map((option, index) => (
            <li
              key={index}
              className={`cursor-pointer flex items-center gap-2 text-sm p-3 transition-all hover:bg-slate-100 ${
                option.isSelected
                  ? "bg-slate-100 font-semibold text-primary"
                  : "text-slate-800"
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option.icon && (
                <span
                  className={`text-gray-500 ${
                    option.isSelected ? "text-primary" : ""
                  }`}
                >
                  {option.icon}
                </span>
              )}
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
