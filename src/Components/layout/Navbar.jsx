import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import navRoutes from "./navRoutes";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // Get the current route location

  useEffect(() => {
    if (i18n.language === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
      document.documentElement.style.fontFamily = "'Noto Kufi Arabic', serif";
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.documentElement.style.fontFamily = "'Roboto', sans-serif";
    }
  }, [i18n.language]);

  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-primary p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">{t("welcome_key")}</h1>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {navRoutes.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              className="relative text-sm font-medium transition-all hover:text-gray-300"
            >
              {t(route.label)}
              {location.pathname === route.path && (
                <motion.div
                  className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-white"
                  layoutId="underline" // Shared layoutId for smooth transition
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </NavLink>
          ))}
        </div>

        {/* Language Dropdown */}
        <div className="relative ml-2">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="cursor-pointer text-center text-sm text-white"
            type="button"
          >
            {i18n.language === "en" ? "English" : "العربية"}
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <ul
              role="menu"
              className="absolute z-10 min-w-[60px] overflow-auto rounded-lg border border-slate-200 bg-white p-1.5 shadow-md focus:outline-none mt-2"
            >
              <li
                role="menuitem"
                className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                onClick={() => toggleLanguage("en")}
              >
                English
              </li>
              <li
                role="menuitem"
                className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
                onClick={() => toggleLanguage("ar")}
              >
                العربية
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
