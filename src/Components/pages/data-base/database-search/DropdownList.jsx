import React from "react";
import { OptionItem } from "./OptionItem";

export const DropdownList = ({
  isOpen,
  isLoading,
  options,
  inputValue,
  t,
  focusedIndex,
  selectedValue,
  formatOptionLabel,
  handleSelect,
  optionsRef,
}) => {
  if (!isOpen) return null;

  return (
    <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
      {isLoading ? (
        <li className="px-4 py-2 text-gray-500">Loading...</li>
      ) : options.length === 0 ? (
        <li className="px-4 py-2 text-gray-500">
          {inputValue
            ? t("no_matching_diseases_key")
            : t("search_diseases_placeholder_key")}
        </li>
      ) : (
        options.map((option, index) => (
          <OptionItem
            key={option.value}
            option={option}
            index={index}
            focusedIndex={focusedIndex}
            isSelected={selectedValue === option.value}
            formatOptionLabel={formatOptionLabel}
            handleSelect={handleSelect}
            optionsRef={optionsRef}
          />
        ))
      )}
    </ul>
  );
};
