import React, { useState, useRef, useEffect } from "react";
import { SearchInput } from "./SearchInput";
import { DropdownList } from "./DropdownList";

export const CustomDropdown = ({
  options,
  selectedValue,
  inputValue,
  onInputChange,
  onSelect,
  onReset,
  isLoading,
  formatOptionLabel,
  t,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const optionsRef = useRef([]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onInputChange(newValue);
    setIsOpen(true);
    setFocusedIndex(-1);
  };

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          handleSelect(options[focusedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll focused option into view
  useEffect(() => {
    if (focusedIndex >= 0 && optionsRef.current[focusedIndex]) {
      optionsRef.current[focusedIndex].scrollIntoView({
        block: "nearest",
      });
    }
  }, [focusedIndex]);

  return (
    <div className="w-full">
      <div className="relative" ref={dropdownRef}>
        <SearchInput
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true);
            setFocusedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onReset={onReset}
          t={t}
          toggleDropdown={toggleDropdown}
          isOpen={isOpen}
          hasSelection={!!selectedValue}
        />
        <DropdownList
          isOpen={isOpen}
          isLoading={isLoading}
          options={options}
          inputValue={inputValue}
          t={t}
          focusedIndex={focusedIndex}
          selectedValue={selectedValue}
          formatOptionLabel={formatOptionLabel}
          handleSelect={handleSelect}
          optionsRef={optionsRef}
        />
      </div>
    </div>
  );
};
