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
import Search from "./Search.jsx";

const Navbar = React.memo(() => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { handleRoute } = useNavigation();
  const { user } = useUserData();

  return (
    <nav
      className={`p-4 text-white fixed w-full top-0 z-20 bg-blend-color-burn will-change-auto ${
        location.pathname !== "/" ? "bg-primary" : "bg-[#000000bb]"
      }`}
    >
      <div className="w-full flex justify-between items-center px-6 relative">
        {/* Mobile Menu Button */}
        {!isMobileMenuOpen && (
          <button
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FaBars size={24} />
          </button>
        )}

        <div className="lg:flex gap-8 w-full">
          <UserDropdown t={t} user={user} />
          <div className="h-12 w-[1px] bg-gray-400 hidden lg:block" />
          <div className="hidden lg:flex gap-4">
            {navItems(t)?.map((route) => (
              <NavItem
                key={route.path}
                route={route}
                isActive={location.pathname === route.path}
                onClick={() => handleRoute(route.path)}
              />
            ))}
          </div>
          <Search user={user} />
        </div>

        {/* Mobile Navigation Menu */}
        <MobileMenu
          t={t}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          navItems={navItems}
          handleRoute={handleRoute}
        />

        {/* Language Toggle */}
        <LanguageToggle />
      </div>
    </nav>
  );
});

export default Navbar;
