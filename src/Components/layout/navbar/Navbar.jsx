import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import UserDropdown from "./UserDropdown.jsx";
import NavItem from "./NavItem.jsx";
import MobileMenu from "./MobileMenu.jsx";
import { LanguageToggle } from "../../LanguageToggle.jsx";
import useNavigation from "../../../hooks/useNavigation.js";
import { navItems } from "./navConfig.js";
import { FaBars } from "react-icons/fa";
import { useUserData } from "../../../hooks/useUserData.js";
import Search from "./Search";

const Navbar = React.memo(() => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { handleRoute } = useNavigation();
  const { user } = useUserData();

  return (
    <nav
      className={`fixed w-full top-0 z-20 ${
        location.pathname !== "/" ? "bg-primary" : "bg-[#000000bb]"
      } bg-blend-color-burn will-change-auto p-3 sm:p-4`}
    >
      <div className="   mx-auto flex justify-between items-center px-4 sm:px-6 relative">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white flex items-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <FaBars size={24} />
        </button>

        {/* Main Navigation Content */}
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 w-full justify-between">
          {/* User Dropdown */}
          <div className=" text-white">
            <UserDropdown t={t} user={user} />
          </div>

          {/* Vertical Divider */}
          <div className="hidden lg:block h-8 w-[1px] bg-gray-400" />

          {/* Navigation Items */}
          <div className="hidden lg:flex items-center gap-4 text-white">
            {navItems(t)?.map((route) => (
              <NavItem
                key={route.path}
                route={route}
                isActive={location.pathname === route.path}
                onClick={() => handleRoute(route.path)}
              />
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xs lg:max-w-sm">
            {user?.id && <Search />}
          </div>

          {/* Language Toggle */}
          <div className="flex items-center">
            <LanguageToggle />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <MobileMenu
          t={t}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          navItems={navItems}
          handleRoute={handleRoute}
        />
      </div>
    </nav>
  );
});

export default Navbar;
