import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import th from "./locales/th.json";

const messages = {
  en,
  th,
};

const i18n = createI18n({
  locale: "en", // default locale
  fallbackLocale: "en",
  messages,
  legacy: false, // use Composition API mode
  globalInjection: true,
});

export default i18n;
