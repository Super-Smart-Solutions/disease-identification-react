import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';
import Cookies from 'js-cookie';

export const LanguageToggle = () => {
  const { i18n } = useTranslation();
  
  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
    Cookies.set('language', lang, { expires: 365 });
  };

  return (
    <div className="flex items-center gap-2">
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-10 h-10 flex items-center justify-center rounded-md ${i18n.language === 'en' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        onClick={() => toggleLanguage('en')}
      >
        EN
      </motion.button>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-10 h-10 flex items-center justify-center rounded-md ${i18n.language === 'ar' ? 'bg-primary text-white' : 'bg-gray-200'}`}
        onClick={() => toggleLanguage('ar')}
      >
        AR
      </motion.button>
      <FaGlobe className="text-white" size={20} />
    </div>
  );
};