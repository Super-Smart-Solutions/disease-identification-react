import React from "react";

const CheckboxInput = ({ label, checked, onChange }) => {
  return (
    <div>
      <label className="inline-flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="text-primary focus:ring-primary border-primary rounded"
        />
        <span className="ltr:ml-2 rtl:mr-2 text-sm text-gray-700">{label}</span>
      </label>
    </div>
  );
};

export default CheckboxInput;
