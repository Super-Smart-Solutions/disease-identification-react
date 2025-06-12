import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

export const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
    Cookies.set("language", lang, { expires: 365 });
  };
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
  return (
    <div className="relative flex items-center gap-1 border border-slate-50 rounded-md overflow-hidden p-1  bg-white text-black">
      {/* English button */}
      <button
        className={` font-semibold cursor-pointer text-sm relative w-8 h-8 flex items-center justify-center rounded-md z-10  transition-colors duration-200 ${
          i18n.language === "en" ? "bg-black text-white" : " "
        } `}
        onClick={() => toggleLanguage("en")}
      >
        EN
      </button>

      {/* Arabic button */}
      <button
        className={` font-semibold cursor-pointer text-sm relative w-8 h-8 flex items-center justify-center rounded-md z-10  transition-colors duration-200 ${
          i18n.language === "ar" ? "bg-black text-white" : " "
        }`}
        onClick={() => toggleLanguage("ar")}
      >
        AR
      </button>
    </div>
  );
};
