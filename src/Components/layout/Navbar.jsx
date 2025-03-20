import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import navRoutes from "./navRoutes";

const Navbar = ({ auth = true }) => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const location = useLocation();

  // Refs for menus and buttons
  const welcomeMenuRef = useRef(null);
  const welcomeButtonRef = useRef(null);
  const languageMenuRef = useRef(null);
  const languageButtonRef = useRef(null);

  // Handle clicks outside the menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close welcome menu if clicked outside
      if (
        welcomeMenuRef.current &&
        !welcomeMenuRef.current.contains(event.target) &&
        welcomeButtonRef.current &&
        !welcomeButtonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }

      // Close language menu if clicked outside
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target) &&
        languageButtonRef.current &&
        !languageButtonRef.current.contains(event.target)
      ) {
        setIsLanguageMenuOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle language and font changes
  useEffect(() => {
    if (i18n.language === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
      document.documentElement.style.fontFamily = "'Noto Kufi Arabic', serif";
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.documentElement.style.fontFamily = "'Roboto', sans-serif";
    }
  }, [i18n.language]);

  // Toggle language
  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setIsLanguageMenuOpen(false);
  };

  return (
    <nav
      className={`p-4 text-white sticky top-0 z-20 bg-blend-color-burn ${
        auth ? "bg-primary" : "bg-black opacity-80"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Welcome Menu */}
        <div className="relative ml-2">
          <span className="text-center text-lg text-white" type="button">
            {t("welcome_key")}
          </span>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <ul
              id="welcome-menu"
              ref={welcomeMenuRef}
              role="menu"
              className="absolute z-10 min-w-[90px] overflow-auto rounded-lg border border-slate-200 bg-white p-1.5 shadow-md focus:outline-none mt-2"
            >
              <li
                role="menuitem"
                className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 text-nowrap"
              >
                <NavLink to={"/auth/register"}>
                  {t("create_account_key")}
                </NavLink>
              </li>
            </ul>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {navRoutes
            .filter((route) =>
              auth ? route.needAuth === true : route.needAuth === false
            )
            .map((route) => (
              <NavLink
                key={route.path} // Use the path as the key
                to={route.path}
                className="relative text-sm font-medium transition-all hover:text-gray-300"
              >
                {t(route.label)} {/* Translate the label */}
                {location.pathname === route.path && (
                  <motion.div
                    className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-white"
                    layoutId="underline"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </NavLink>
            ))}
        </div>

        {/* Language Dropdown */}
        <div className="relative ml-2">
          <button
            ref={languageButtonRef}
            onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
            className="cursor-pointer text-center text-sm text-white"
            type="button"
          >
            {i18n.language === "en" ? "English" : "العربية"}
          </button>

          {/* Dropdown Menu */}
          {isLanguageMenuOpen && (
            <ul
              id="language-menu"
              ref={languageMenuRef}
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
