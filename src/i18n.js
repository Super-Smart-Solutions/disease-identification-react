import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';
import Cookies from "js-cookie";

i18n.use(initReactI18next).init({
    lng: Cookies.get("language") || "ar",
    fallbackLng: Cookies.get("language") || "ar",
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