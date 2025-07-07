// components/Navbar.js
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import navRoutes from "./navRoutes";

import {
  FaSignOutAlt,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { useAuthActions } from "../helpers/authHelpers";
import { RiAdminFill } from "react-icons/ri";
import DropdownMenu from "../DropdownMenu";
import { useUserData } from "../../hooks/useUserData";
import { LanguageToggle } from "../LanguageToggle";

const Navbar = React.memo(() => {
  const { t } = useTranslation();
  const { logout } = useAuthActions();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserData();

  // Welcome dropdown options
  const welcomeOptions = [
    {
      label: t("profile_key"),
      icon: <FaUser />,
      onClick: () => {
        navigate("/profile");
      },
    },
    {
      label: t("dashboard_key"),
      icon: <RxDashboard />,
      onClick: () => {
        navigate("/dashboard");
      },
    },
    ...(Array.isArray(user?.roles) && user.roles[0]?.name === "superuser"
      ? [
          {
            label: t("admin_key"),
            icon: <RiAdminFill />,
            onClick: () => {
              navigate("/admin/inferences");
            },
          },
        ]
      : []),
    {
      label: t("logout_key"),
      icon: <FaSignOutAlt />,
      onClick: () => {
        logout();
        window.location.href = "/";
      },
    },
  ];

  return (
    <nav
      className={`p-4 text-white fixed w-full top-0 z-20 bg-blend-color-burn will-change-auto ${
        user && location.pathname !== "/" ? "bg-primary" : "bg-[#000000bb]"
      }`}
    >
      <div
        dir="rtl"
        className="w-full flex justify-between items-center px-6 relative"
      >
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? "" : <FaBars size={24} />}
        </button>

        {/* Welcome Menu */}
        <div className="lg:block">
          {user ? (
            <DropdownMenu
              buttonContent={
                <div className="flex items-center gap-2">
                  {user?.avatar ? (
                    <img
                      src={user?.avatar || "/user-avatar.png"}
                      alt="User avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle size={24} />
                  )}
                  <span className="text-lg text-white hidden lg:inline">
                    {t("welcome_key")}{" "}
                    {user?.first_name && (
                      <span className="font-bold">{user?.first_name}</span>
                    )}
                  </span>
                </div>
              }
              options={welcomeOptions}
            />
          ) : (
            <span className="text-lg text-white hidden lg:block w-1/3">
              {t("welcome_key")}
            </span>
          )}
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-6">
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

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden fixed inset-0 bg-primary-90 z-50 transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-start-50" : "-translate-x-full"
          }`}
        >
          <button
            className="lg:hidden text-white relative start-10 top-5"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : ""}
          </button>
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {navRoutes.map((route) => (
              <NavLink
                key={route.path}
                to={route.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-xl font-medium text-white hover:text-gray-300"
              >
                {t(route.label)}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Language Toggle */}
        <LanguageToggle />
      </div>
    </nav>
  );
});

export default Navbar;
