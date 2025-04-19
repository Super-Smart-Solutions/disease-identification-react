import React from "react";
import { useNavigate } from "react-router-dom";

const Breadcrumbs = ({ items }) => {
  const navigate = useNavigate();

  const handleNavigation = (href) => {
    navigate(href); // Navigate without a full page reload
  };

  return (
    <nav className="flex items-center space-s-2 text-gray-500">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {/* Breadcrumb Item */}
          {item.isCurrentPage ? (
            <span className="text-gray-800 font-semibold">{item.label}</span>
          ) : (
            <button
              onClick={() => handleNavigation(item.href)}
              className="hover:underline hover:text-primary"
            >
              {item.label}
            </button>
          )}

          {/* Separator */}
          {index < items.length - 1 && (
            <span className="mr-1 ml-2 mt-1 text-gray-400">{">"}</span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
