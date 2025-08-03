import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const NavItem = ({ route, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center gap-2 p-2 min-w-8 rounded-md cursor-pointer transition-colors duration-200 ${
        isActive
          ? "bg-inherit after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-current"
          : ""
      } hover:bg-inherit`}
    >
      {<route.icon size={22} />}
      <AnimatePresence>
        <motion.span
          className="text-sm font-medium text-nowrap"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "auto", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {route.label}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default NavItem;
