<template>
  <BookDetail :book-data="drawYourThoughtsBook" />
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import BookDetail from "@/components/books/BookDetail.vue";
import drawYourThoughtsThumbnail from "@/assets/images/draw-your-thoughts-thumbnail.webp";
import dharmaScienceThumb from "@/assets/images/dharmoscience-thumbnail.webp";
import neodharmaThumb from "@/assets/images/neodharma-thumbnail.webp";
import sankharaThumb from "@/assets/images/sankhara-thumbnail.webp";
import nirvanaThumb from "@/assets/images/nirvana-thumbnail.webp";
import buy01 from "@/assets/images/buy-01.webp";
import buy02 from "@/assets/images/buy-02.webp";
import buy03 from "@/assets/images/buy-03.webp";
import buy04 from "@/assets/images/buy-04.webp";
import buy05 from "@/assets/images/buy-05.webp";

const { t } = useI18n();

const drawYourThoughtsBook = computed(() => ({
  title: t("pages.bookDetails.drawYourThoughts.title"),
  image: drawYourThoughtsThumbnail,
  shortDescription: t("pages.bookDetails.drawYourThoughts.shortDescription"),
  description: t("pages.bookDetails.drawYourThoughts.description"),
  additionalInfo1: t("pages.bookDetails.drawYourThoughts.additionalInfo1"),
  additionalInfo2: t("pages.bookDetails.drawYourThoughts.additionalInfo2"),
  series: t("pages.bookDetails.drawYourThoughts.series"),
  colorScheme: "blue", // Will use the blue gradient
  relatedBooks: [], // No related books for this example
  stores: [
    {
      name: "Amazon",
      image: buy01,
      link: "https://amazon.com",
    },
    {
      name: "Barnes & Noble",
      image: buy02,
      link: "https://barnesandnoble.com",
    },
    {
      name: "Apple Books",
      image: buy03,
      link: "https://apple.com/apple-books",
    },
    {
      name: "Google Play",
      image: buy04,
      link: "https://play.google.com/store/books",
    },
    {
      name: "Kobo",
      image: buy05,
      link: "https://kobo.com",
    },
  ],
}));
</script>
