<template>
  <BookDetail :book-data="dharmaScienceBook" />
</template>

<script setup>
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

const dharmaScienceBook = {
  title: "Nirvana",
  image: nirvanaThumb,
  shortDescription: "",
  description:
    "Spiritual enlightenment, nirvana, is the ultimate spiritual goal among the eastern religions, philosophy and metaphysics. Within the book, this profound, complex and often misunderstood concept from the various religions and differing schools of thought as well as modern science, are brought together in order to create a common conceptual framework. The concept is then elaborated and visually illustrated with several simple diagrams for easy understanding. Visual nirvana roadmaps are also provided as the navigating tool for spiritual seekers on their ultimate journey.",
  additionalInfo1: "",
  additionalInfo2: "",
  series: "Dharmoscience Series",
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
};
</script>
