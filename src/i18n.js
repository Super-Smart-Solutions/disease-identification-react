import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';

i18n.use(initReactI18next).init({
    lng: localStorage.getItem("language") || "ar",
    fallbackLng: localStorage.getItem("language") || "ar",
    resources: {
        en: {
            translation: enTranslations,
        },
        ar: {
            translation: arTranslations,
        },
    },
});
export default i18n