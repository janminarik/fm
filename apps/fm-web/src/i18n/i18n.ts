import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import {
  SUPPORTED_LANGUAGES,
  TRANSLATIONS_DEFAULT_NAMESPACE,
  TRANSLATIONS_NAMESPACES,
} from "./config";
import Resources from "./resources.d";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: Resources;
  }
}

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: "/i18n/translations/{{lng}}/{{ns}}.json",
    },
    defaultNS: TRANSLATIONS_DEFAULT_NAMESPACE,
    fallbackLng: SUPPORTED_LANGUAGES[0],
    // debug: true,
    interpolation: {
      escapeValue: false,
    },
    ns: [
      TRANSLATIONS_NAMESPACES.SHARED,
      TRANSLATIONS_NAMESPACES.AUTH,
      TRANSLATIONS_NAMESPACES.SETTNGS,
    ],
    // detection: {
    //     order: ["navigator", "htmlTag", "cookie", "localStorage", "sessionStorage", "path", "subdomain"],
    //     caches: ["cookie"], // Cache metódy na uloženie jazyka (voliteľné)
    // },
  });

export default i18n;
