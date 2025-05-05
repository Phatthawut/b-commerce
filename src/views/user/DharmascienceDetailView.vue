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
  title: "Dharmascience",
  image: dharmoscienceThumbnail,
  shortDescription:
    "Explore the intersection of modern science and ancient wisdom in this groundbreaking series.",
  description:
    'The main content of this book series (4 volumes) explains that, in essence, "Dharma is Science, and Science is Dharma." It merges modern science with the traditional wisdom of Dharma into a unified whole, calling this new body of knowledge "Dharmoscience." This will enable readers to deeply and profoundly understand the truths of nature.',
  additionalInfo1:
    "Written by renowned philosopher and spiritual teacher Dr. Vuthiphong Priebjrivat, this series brings together decades of research and insight.",
  additionalInfo2:
    "Perfect for readers interested in philosophy, science, spirituality, and the search for deeper meaning and understanding.",
  series: "Dharmoscience Series",
  colorScheme: "red",
  relatedBooks: [
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
    {
      title: "Nirvana",
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
};
</script>
