import { computed } from "vue";
import { useI18n } from "vue-i18n";

export function useDynamicFont() {
  const { locale } = useI18n();

  // Dynamic font classes based on current language
  const titleFont = computed(() => {
    return locale.value === "th" ? "font-thai" : "font-merriweather";
  });

  const headingFont = computed(() => {
    return locale.value === "th" ? "font-thai" : "font-montserrat";
  });

  const bodyFont = computed(() => {
    return locale.value === "th" ? "font-thai" : "font-montserrat";
  });

  // Text alignment based on language
  const textAlignment = computed(() => {
    return locale.value === "th" ? "text-left" : "text-justify";
  });

  // Combined classes for different text types
  const titleClasses = computed(() => {
    return locale.value === "th"
      ? "font-prompt font-bold"
      : "font-merriweather font-bold italic";
  });

  const headingClasses = computed(() => {
    return locale.value === "th"
      ? "font-prompt font-semibold"
      : "font-montserrat font-semibold";
  });

  const bodyClasses = computed(() => {
    return locale.value === "th" ? "font-thai" : "font-montserrat";
  });

  // Combined classes including text alignment
  const titleClassesWithAlignment = computed(() => {
    return locale.value === "th"
      ? "font-prompt font-bold text-left"
      : "font-merriweather font-bold italic text-justify";
  });

  const headingClassesWithAlignment = computed(() => {
    return locale.value === "th"
      ? "font-prompt font-semibold text-left"
      : "font-montserrat font-semibold text-justify";
  });

  const bodyClassesWithAlignment = computed(() => {
    return locale.value === "th"
      ? "font-thai text-left"
      : "font-montserrat text-justify";
  });

  return {
    locale,
    titleFont,
    headingFont,
    bodyFont,
    textAlignment,
    titleClasses,
    headingClasses,
    bodyClasses,
    titleClassesWithAlignment,
    headingClassesWithAlignment,
    bodyClassesWithAlignment,
  };
}
