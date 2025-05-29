<template>
  <button
    @click="toggleLanguage"
    class="inline-flex items-center justify-center px-3 text-sm font-medium text-gray-600 hover:text-white hover:bg-[#81c1c6] rounded-md transition-colors duration-200"
    :title="$t('common.language')"
  >
    <i class="fas fa-globe mr-2"></i>
    <span class="mr-1">{{ currentFlag }}</span>
    <span>{{ currentLanguageLabel }}</span>
  </button>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useLanguage } from "@/composables/useLanguage";

const { t } = useI18n();
const { locale, changeLanguage } = useLanguage();

const currentFlag = computed(() => {
  return locale.value === "en" ? "🇺🇸" : "🇹🇭";
});

const currentLanguageLabel = computed(() => {
  return locale.value === "en" ? t("common.english") : t("common.thai");
});

const toggleLanguage = () => {
  const newLanguage = locale.value === "en" ? "th" : "en";
  changeLanguage(newLanguage);
};
</script>

<style scoped>
button {
  user-select: none;
}

button:focus {
  outline: 2px solid #81c1c6;
  outline-offset: 2px;
}
</style>
