import React from "react";

const RadioInput = ({ label, name, options, value, onChange }) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="space-x-4">
        {options.map((option) => (
          <label key={option.value} className="inline-flex items-center">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="text-primary focus:ring-primary border-primary"
            />
            <span className="ltr:ml-2 rtl:mr-2">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioInput;
