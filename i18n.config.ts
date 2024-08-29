// https://github.com/KaterinaLupacheva/tutorials
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import localesResourse from "./app/assets/locales";
const {
  languageDetectorPlugin,
} = require("./app/themes/languageDetectorPlugin");

i18n
  .use(initReactI18next)
  .use(languageDetectorPlugin)
  .init({
    resources: localesResourse,
    // language to use if translations in user language are not available
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react!!
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
