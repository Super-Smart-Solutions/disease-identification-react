import React, { useRef, useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const DropdownMenu = ({ buttonContent, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find((opt) => opt.isSelected) || null
  );
  const dropdownRef = useRef(null);
  const [menuDirection, setMenuDirection] = useState("down");

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Calculate menu position
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const buttonRect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      const menuHeight = options.length * 40 + 16; // Approximate menu height

      setMenuDirection(
        spaceBelow > menuHeight || spaceBelow > spaceAbove ? "down" : "up"
      );
    }
  }, [isOpen, options.length]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    if (option.onClick) {
      option.onClick();
    }
    setSelectedOption(option);
    setIsOpen(false);
  };

  // Determine button display content
  const displayContent =
    buttonContent ||
    (selectedOption ? selectedOption.label : "Select an option");

  // Animation variants for the menu
  const menuVariants = {
    hidden: {
      opacity: 0,
      y: menuDirection === "down" ? 10 : -10,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" },
    },
  };

  // Animation for the chevron
  const chevronVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 },
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={toggleMenu}
        className={`flex items-center gap-2 rounded-md ${
          buttonContent ? "" : "border border-slate-200"
        } px-3 py-2 text-sm`}
        type="button"
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.1 }}
      >
        {displayContent}
        <motion.span
          variants={chevronVariants}
          animate={isOpen ? "open" : "closed"}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown size={14} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={`absolute z-10 min-w-[140px] overflow-auto rounded-lg border border-slate-200 bg-white shadow-md ${
              menuDirection === "down" ? "mt-2" : "mb-2 bottom-full"
            } -end-8`}
            style={{
              maxHeight: "calc(100vh - 100px)", // Prevent going off-screen vertically
              overflowY: "auto",
            }}
          >
            {options.map((option, index) => (
              <motion.li
                key={index}
                className={`cursor-pointer flex items-center gap-2 text-sm p-3 transition-all hover:bg-slate-100 ${
                  selectedOption === option
                    ? "bg-slate-100 font-semibold text-primary"
                    : "text-slate-800"
                }`}
                onClick={() => handleOptionClick(option)}
                whileHover={{ backgroundColor: "rgba(203, 213, 225, 0.1)" }}
                transition={{ duration: 0.1 }}
              >
                {option.icon && (
                  <span
                    className={`text-gray-500 ${
                      selectedOption === option ? "text-primary" : ""
                    }`}
                  >
                    {<option.icon size={16} />}
                  </span>
                )}
                {option.label}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownMenu;
