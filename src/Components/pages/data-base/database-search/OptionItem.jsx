import React from "react";

export const OptionItem = ({
  option,
  index,
  focusedIndex,
  isSelected,
  formatOptionLabel,
  handleSelect,
  optionsRef,
}) => (
  <li
    key={option.value}
    ref={(el) => (optionsRef.current[index] = el)}
    onClick={() => handleSelect(option)}
    className={`px-4 py-2 cursor-pointer hover:bg-primary-20 ${
      isSelected ? "bg-primary-50" : ""
    } ${focusedIndex === index ? "bg-primary-20 ring-2 ring-primary-100" : ""}`}
  >
    {formatOptionLabel(option)}
  </li>
);
