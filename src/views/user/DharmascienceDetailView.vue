<template>
  <BookDetail :book-data="dharmaScienceBook" />
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import BookDetail from "@/components/books/BookDetail.vue";
import dharmoscienceThumbnail from "@/assets/images/dharmoscience-thumbnail.webp";
import neodharmaThumb from "@/assets/images/neodharma-thumbnail.webp";
import sankharaThumb from "@/assets/images/sankhara-thumbnail.webp";
import nirvanaThumb from "@/assets/images/nirvana-thumbnail.webp";
import buy01 from "@/assets/images/buy-01.webp";
import buy02 from "@/assets/images/buy-02.webp";
import buy03 from "@/assets/images/buy-03.webp";
import buy04 from "@/assets/images/buy-04.webp";
import buy05 from "@/assets/images/buy-05.webp";

const { t } = useI18n();

const dharmaScienceBook = computed(() => ({
  title: t("pages.bookDetails.dharmoscience.title"),
  image: dharmoscienceThumbnail,
  shortDescription: t("pages.bookDetails.dharmoscience.shortDescription"),
  description: t("pages.bookDetails.dharmoscience.description"),
  additionalInfo1: t("pages.bookDetails.dharmoscience.additionalInfo1"),
  additionalInfo2: t("pages.bookDetails.dharmoscience.additionalInfo2"),
  series: t("pages.bookDetails.dharmoscience.series"),
  colorScheme: "red",
  relatedBooks: [
    {
      title: t("pages.bookDetails.neodharma.title"),
      image: neodharmaThumb,
      link: "neodharma",
    },
    {
      title: t("pages.bookDetails.sankhara.title"),
      image: sankharaThumb,
      link: "sankhara",
    },
    {
      title: t("pages.bookDetails.nirvana.title"),
      image: nirvanaThumb,
      link: "nirvana",
    },
  ],
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
