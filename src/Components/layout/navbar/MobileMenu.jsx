import React from "react";
import { FaTimes } from "react-icons/fa";

const MobileMenu = ({ isOpen, onClose, navItems, handleRoute, t }) => {
  return (
    <div
      className={`lg:hidden fixed inset-0 bg-primary-90 z-50 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <button
        className="lg:hidden text-white relative start-10 top-6"
        onClick={onClose}
      >
        <FaTimes size={24} />
      </button>
      <div className="flex flex-col items-center justify-center h-full space-y-8">
        {navItems(t)?.map((route) => (
          <div
            key={route.path}
            onClick={() => {
              handleRoute(route.path);
              onClose();
            }}
            className="flex items-center gap-2 text-xl font-medium text-white hover:bg-primary-90 cursor-pointer transition-colors duration-200"
          >
            {<route.icon size={22} />}
            <span>{route.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
