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
  title: t("pages.bookDetails.nirvana.title"),
  image: nirvanaThumb,
  shortDescription: t("pages.bookDetails.nirvana.shortDescription"),
  description: t("pages.bookDetails.nirvana.description"),
  additionalInfo1: t("pages.bookDetails.nirvana.additionalInfo1"),
  additionalInfo2: t("pages.bookDetails.nirvana.additionalInfo2"),
  series: t("pages.bookDetails.nirvana.series"),
  colorScheme: "purple",
  backgroundColor: "purple",
  relatedBooks: [
    {
      title: "Dharmascience",
      image: dharmoscienceThumbnail,
      link: "dharmascience",
    },
    {
      title: "Neodharma",
      image: neodharmaThumb,
      link: "neodharma",
    },
    {
      title: "Sankhara",
      image: sankharaThumb,
      link: "sankhara",
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
