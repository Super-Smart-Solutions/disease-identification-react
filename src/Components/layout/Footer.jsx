import React from "react";
import { useTranslation } from "react-i18next";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import logo from "../../assets/logo.jpg";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="text-white">
      <div className="mx-auto max-w-screen-xl px-4 pt-16  sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-3 items-center">
          {/* Left Section - Contact Info */}
          <div className="flex flex-col items-center md:items-start gap-4">
            {/* Email */}
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-black" />
              <span className="font-medium text-black  transition-colors">
                support@ss-solution.org
              </span>
            </div>

            {/* Powered By */}
            <div className="flex items-center gap-3">
              <span className="font-medium text-black">
                Powered by: SuperSmartSolutions
              </span>
            </div>
          </div>

          {/* Center Section - Logo */}
          <div className="flex justify-center">
            <img src={logo} alt="Company Logo" className="max-h-30 w-auto" />
          </div>

          {/* Right Section - Links */}
          <div className="flex flex-col items-center md:items-end justify-end gap-4">
            <ul className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
              <li>
                <a href="#" className="text-gray-400  transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400  transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400  transition-colors">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
