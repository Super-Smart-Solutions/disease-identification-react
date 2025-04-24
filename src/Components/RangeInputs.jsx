import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const RangeInputs = ({
  label,
  range = { min: 0, max: 100 },
  value = { min: "", max: "" },
  setValue,
}) => {
  const { t } = useTranslation();
  const [error, setError] = useState("");

  const isValidFloat = (val) => /^-?\d*(\.\d+)?$/.test(val);

  useEffect(() => {
    const minFloat = parseFloat(value.min);
    const maxFloat = parseFloat(value.max);

    if (value.min === "" || value.max === "") {
      setError("");
      return;
    }

    if (!isValidFloat(value.min) || !isValidFloat(value.max)) {
      setError(t("invalid_number_error_key"));
    } else if (minFloat > maxFloat) {
      setError(t("min_gt_max_error_key", { min: value.min, max: value.max }));
    } else if (minFloat < range?.min || maxFloat > range?.max) {
      setError(
        t("out_of_range_error_key", {
          minValue: value.min,
          maxValue: value.max,
          minAllowed: range?.min,
          maxAllowed: range?.max,
        })
      );
    } else {
      setError("");
    }
  }, [value, range?.min, range?.max, t]);

  const handleChange = (field, inputValue) => {
    setValue((prev) => ({
      ...prev,
      [field]: inputValue,
    }));
  };

  return (
    <div className="flex flex-col space-y-2 w-full max-w-md">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {t(label)}
      </label>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          className="custom-input"
          value={value.min}
          onChange={(e) => handleChange("min", e.target.value)}
          placeholder={t("min_placeholder_key", { min: range.min })}
        />
        <span className="block text-sm font-medium text-gray-700">
          {" "}
          {t("to_key")}
        </span>
        <input
          type="text"
          className="custom-input"
          value={value.max}
          onChange={(e) => handleChange("max", e.target.value)}
          placeholder={t("max_placeholder_key", { max: range.max })}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default RangeInputs;
