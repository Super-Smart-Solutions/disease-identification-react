import React from "react";

const VerticalSteps = ({ activeStep, steps }) => {
  return (
    <div className="flex flex-col space-y-12 h-full">
      {steps.map((step, index) => (
        <div key={index} className="relative flex items-start cursor-pointer">
          {/* Step Indicator */}
          <span
            className={`flex-shrink-0 rounded-full ${
              activeStep >= index + 1 ? "bg-orange-400" : "bg-gray-300"
            } text-white`}
          >
            <svg
              className="size-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </span>

          {/* Vertical Line (Connector) */}
          {index < steps.length - 1 && (
            <div
              className={`absolute left-[0.625rem] top-8 h-full w-0.5 ${
                activeStep > index + 1 ? "bg-primaryGray" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default VerticalSteps;
