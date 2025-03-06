import React from "react";

const Input = ({ label, type = "text", value, onChange, placeholder }) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="custom-input"
      />
    </div>
  );
};

export default Input;
