import React, { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import navRoutes from "./navRoutes";
import { logout } from "../helpers/authHelpers";

const Navbar = React.memo(({ auth = true }) => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const firstName = user?.first_name || "";
  const welcomeMenuRef = useRef(null);
  const welcomeButtonRef = useRef(null);
  const languageMenuRef = useRef(null);
  const languageButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        welcomeMenuRef.current &&
        !welcomeMenuRef.current.contains(event.target) &&
        welcomeButtonRef.current &&
        !welcomeButtonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }

      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target) &&
        languageButtonRef.current &&
        !languageButtonRef.current.contains(event.target)
      ) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleLanguage = useCallback(
    (lang) => {
      i18n.changeLanguage(lang);
      Cookies.set("language", lang, { expires: 365 });
      setIsLanguageMenuOpen(false);
    },
    [i18n]
  );

  const handleLogout = useCallback(() => {
    logout();
    navigate("/auth/login");
  }, [navigate]);

  useEffect(() => {
    if (i18n.language === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
      document.documentElement.style.fontFamily = "'Noto Kufi Arabic', serif";
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.documentElement.style.fontFamily = "'Roboto', sans-serif";
    }
  }, [i18n.language]);

  return (
    <nav
      className={`p-4 text-white sticky top-0 z-20 bg-blend-color-burn ${
        auth ? "bg-primary" : "bg-black opacity-80"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Welcome Menu */}
        <div className="relative ml-2">
          <button
            ref={welcomeButtonRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-center text-lg text-white flex items-center gap-2"
            type="button"
          >
            <span>{t("welcome_key")}</span>
            {firstName && <span className="font-bold">{firstName}</span>}
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && auth && (
            <ul
              id="welcome-menu"
              ref={welcomeMenuRef}
              role="menu"
              className="absolute z-10 min-w-[120px] overflow-auto rounded-lg border border-slate-200 bg-white p-1.5 shadow-md focus:outline-none mt-2"
            >
              <li
                role="menuitem"
                className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100 text-nowrap"
                onClick={handleLogout}
              >
                {t("logout_key")}
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
                key={route.path}
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
});

export default Navbar;
