import React from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

const Button = ({
  children,
  variant = "filled",
  size = "medium",
  loading = false,
  className,
  ...props
}) => {
  const { t } = useTranslation();
  // Define base styles
  const baseStyles =
    "font-semibold rounded-lg focus:outline-none transition-all duration-200 ease-in-out";

  // Define variant styles
  const variantStyles = {
    filled: "bg-primary text-white hover:bg-primaryDarker",
    outlined:
      "border border-primary text-primary hover:bg-primary hover:text-white",
    default: "bg-gray-500 text-white hover:bg-gray-600",
  };

  // Define size styles
  const sizeStyles = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-1.5 text-base",
    large: "px-6 py-1.5 text-lg",
  };

  // Define responsive styles
  const responsiveStyles = "w-full sm:w-auto";

  // Combine all styles using classnames
  const buttonClasses = classNames(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    responsiveStyles,
    className,
    {
      "opacity-50 cursor-not-allowed": loading, // Disabled state styles
      "hover:bg-primary": !loading && variant === "filled", // Remove hover for filled
      "hover:bg-primary hover:text-white": !loading && variant === "outlined", // Remove hover for outlined
      "hover:bg-gray-600": !loading && variant === "default", // Remove hover for default
    }
  );

  return (
    <button className={buttonClasses} disabled={loading} {...props}>
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          {t("loading_key")}
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
