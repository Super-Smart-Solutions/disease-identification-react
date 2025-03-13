import React from "react";
import Select from "react-select";

const SelectInput = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  ...props
}) => {
  return (
    <div className=" grow">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Select
        options={options}
        value={options.find((option) => option.value === value || null)}
        onChange={(selectedOption) => onChange(selectedOption)}
        placeholder={placeholder}
        className="react-select-container"
        classNamePrefix="react-select"
        styles={{
          control: (base, { isFocused }) => ({
            ...base,
            borderColor: isFocused ? "#416a00" : "#e5e7eb",
            boxShadow: isFocused ? "0 0 0 1px #416a00" : "none",
            "&:hover": {
              borderColor: "#416a00",
            },
          }),
          option: (base, { isFocused, isSelected }) => ({
            ...base,
            backgroundColor: isSelected
              ? "#416a00"
              : isFocused
              ? "#416a0020"
              : "white",
            color: isSelected ? "white" : "black",
          }),
          menu: (base) => ({
            ...base,
            borderColor: "#416a00",
          }),
        }}
        {...props}
      />
    </div>
  );
};

export default SelectInput;
