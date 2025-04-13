import React from "react";

export default function CircularProgress({ percent }) {
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className=" rotate-90">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#10b981"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 1s ease" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="#000"
          fontSize="14px"
          fontWeight="bold"
        >
          {percent}%
        </text>
      </svg>
    </div>
  );
}
