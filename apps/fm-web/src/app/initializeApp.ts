import { persistor, store } from "./store";
import { setLanguage } from "../features/settings/slices/uiSettingsSlice";
import i18n from "../i18n/i18n";
import { Language } from "../shared/types/commonTypes";

export const initializeApp = async () => {
  await new Promise<void>((resolve) => {
    const unsubscribe = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        unsubscribe();
        resolve();
      }
    });
  });

  const state = store.getState();
  const language = state.uiSettings.language;

  if (language) {
    await i18n.changeLanguage(language);
  } else {
    let detectedLanguages = i18n.services.languageDetector?.detect() || [];

    if (!Array.isArray(detectedLanguages)) {
      detectedLanguages = [detectedLanguages];
    }

    const supportedLanguages = Object.values(Language); // ["en", "sk"]
    const preferredLanguage =
      detectedLanguages.find((lang: Language) =>
        supportedLanguages.includes(lang),
      ) || Language.English;

    await i18n.changeLanguage(preferredLanguage);

    store.dispatch(setLanguage(preferredLanguage));
  }
};
