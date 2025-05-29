import { watch } from "vue";
import { useI18n } from "vue-i18n";

export function useLanguage() {
  const { locale } = useI18n();

  // Load saved language preference on app start
  const initializeLanguage = () => {
    const savedLanguage = localStorage.getItem("preferred-language");
    if (savedLanguage && ["en", "th"].includes(savedLanguage)) {
      locale.value = savedLanguage;
    }
  };

  // Watch for locale changes and save to localStorage
  watch(
    locale,
    (newLocale) => {
      localStorage.setItem("preferred-language", newLocale);
      // Update document direction for RTL languages if needed
      document.documentElement.setAttribute("lang", newLocale);
    },
    { immediate: true }
  );

  const changeLanguage = (lang) => {
    if (["en", "th"].includes(lang)) {
      locale.value = lang;
    }
  };

  return {
    locale,
    initializeLanguage,
    changeLanguage,
  };
}
