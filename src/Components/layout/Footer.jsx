import React from "react";
import logo from "../../assets/logo.jpg";

export default function Footer() {
  return (
    <footer className="">
      <div className="mx-auto max-w-screen-xl px-4 pt-16  sm:px-6 lg:px-8 lg:pt-8">
        <div className=" flex justify-between items-center">
          {/* Center Section - Logo */}
          <div className="flex justify-end w-2/3 ">
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
