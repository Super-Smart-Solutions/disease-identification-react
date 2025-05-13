import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import dashboardRouts from "./dashboardRouts";
import { FaArrowLeft } from "react-icons/fa";

export default function SideNavigation({ isExpanded, setIsExpanded }) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <motion.div
      className={`bg-white shadow-md flex flex-col h-full overflow-x-hidden `}
      initial={{ width: 256 }}
      animate={{ width: isExpanded ? 256 : 60 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center border-b border-slate-100 p-4">
        {isExpanded && (
          <h1 className="text-xl font-semibold">{t("dashboard_key")}</h1>
        )}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer p-1 rounded-full hover:bg-gray-100"
        >
          <FaArrowLeft className="text-lg" />
        </motion.div>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 p-2">
          {dashboardRouts.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <button
                onClick={() => handleNavigation(path)}
                className={`w-full text-left flex items-center p-3 rounded-lg justify-start ${
                  location.pathname === path
                    ? "bg-primary-10 text-primary"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="text-lg" />
                {isExpanded && (
                  <span className="ms-3 max-w-full truncate  transition">
                    {t(label)}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
}
