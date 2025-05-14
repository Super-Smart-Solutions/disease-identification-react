// components/Navbar.js
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import navRoutes from "./navRoutes";

import {
  FaChevronDown,
  FaChevronUp,
  FaSignOutAlt,
  FaGlobe,
  FaUserCircle,
} from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { useAuthActions } from "../helpers/authHelpers";
import { RiAdminFill } from "react-icons/ri";

// Dropdown Component
const DropdownMenu = ({
  buttonRef,
  menuRef,
  isOpen,
  toggle,
  buttonContent,
  options,
  position = "left",
  buttonClassName = "",
  menuClassName = "",
}) => {
  return (
    <div className="relative ">
      <button
        ref={buttonRef}
        onClick={toggle}
        className={`flex items-center gap-2 ${buttonClassName}`}
        type="button"
      >
        {buttonContent}
        {isOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
      </button>

      {isOpen && (
        <ul
          ref={menuRef}
          className={`absolute z-10 min-w-[160px] overflow-auto rounded-lg border border-slate-200 bg-white shadow-md mt-2 ${
            position === "right" ? "-right-6" : "left-0"
          } ${menuClassName}`}
        >
          {options.map((option, index) => (
            <li
              key={index}
              className="cursor-pointer text-slate-800 flex items-center gap-2 text-sm p-3 transition-all hover:bg-slate-100"
              onClick={option.onClick}
            >
              {option.icon && (
                <span className="text-gray-500">{option.icon}</span>
              )}
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Navbar = React.memo(({ auth = true }) => {
  const { t, i18n } = useTranslation();
  const { logout } = useAuthActions();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const firstName = user?.first_name || "";
  const userAvatar = user?.avatar;
  const welcomeMenuRef = useRef(null);
  const welcomeButtonRef = useRef(null);
  const languageMenuRef = useRef(null);
  const languageButtonRef = useRef(null);
  const ADMIN_URL = import.meta.env.VITE_ADMIN_URL;

  // Close menus when clicking outside
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLanguage = useCallback(
    (lang) => {
      i18n.changeLanguage(lang);
      Cookies.set("language", lang, { expires: 365 });
      setIsLanguageMenuOpen(false);
    },
    [i18n]
  );

  useEffect(() => {
    if (i18n.language === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
      document.documentElement.classList.add("font-arabic");
      document.documentElement.classList.remove("font-english");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.documentElement.classList.add("font-english");
      document.documentElement.classList.remove("font-arabic");
    }
  }, [i18n.language]);

  // Welcome dropdown options
  const welcomeOptions = [
    {
      label: t("dashboard_key"),
      icon: <RxDashboard />,
      onClick: () => {
        navigate("/dashboard");
      },
    },
    {
      label: t("logout_key"),
      icon: <FaSignOutAlt />,
      onClick: () => {
        logout();
        window.location.href = "/";
      },
    },
    ...(Array.isArray(user?.roles) && user.roles[0]?.name === "super_user"
      ? [
          {
            label: t("admin_key"),
            icon: <RiAdminFill />,
            onClick: () => {
              navigate("/admin");
            },
          },
        ]
      : []),
  ];

  // Language dropdown options
  const languageOptions = [
    {
      label: "English",
      onClick: () => toggleLanguage("en"),
      isSelected: i18n.language === "en",
    },
    {
      label: "العربية",
      onClick: () => toggleLanguage("ar"),
      isSelected: i18n.language === "ar",
    },
  ];

  return (
    <nav
      className={`p-4 text-white sticky top-0 z-20 bg-blend-color-burn will-change-auto ${
        auth && location.pathname !== "/" ? "bg-primary" : "bg-black opacity-80"
      }`}
    >
      <div className="w-full flex justify-between items-center px-6">
        {/* Welcome Menu */}
        {auth ? (
          <DropdownMenu
            buttonRef={welcomeButtonRef}
            menuRef={welcomeMenuRef}
            isOpen={isMenuOpen}
            toggle={() => setIsMenuOpen(!isMenuOpen)}
            buttonContent={
              <div className="flex items-center gap-2">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt="User avatar"
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "user-avatar.png";
                    }}
                  />
                ) : (
                  <FaUserCircle size={24} />
                )}
                <span className="text-lg text-white">
                  {t("welcome_key")}{" "}
                  {firstName && <span className="font-bold">{firstName}</span>}
                </span>
              </div>
            }
            options={welcomeOptions}
            position="left"
            buttonClassName="text-white"
          />
        ) : (
          <span className="text-lg text-white w-1/3">{t("welcome_key")}</span>
        )}

        {/* Navigation Links */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-6">
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
                  layoutId="underline"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </NavLink>
          ))}
        </div>

        {/* Language Dropdown */}
        <DropdownMenu
          buttonRef={languageButtonRef}
          menuRef={languageMenuRef}
          isOpen={isLanguageMenuOpen}
          toggle={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
          buttonContent={
            <div className="flex items-center gap-2 text-sm text-white">
              <FaGlobe size={16} />
              {i18n.language === "en" ? "English" : "العربية"}
            </div>
          }
          options={languageOptions}
          position={i18n.language === "en" ? "right" : "left"}
          buttonClassName="text-white"
        />
      </div>
    </nav>
  );
});

export default Navbar;
