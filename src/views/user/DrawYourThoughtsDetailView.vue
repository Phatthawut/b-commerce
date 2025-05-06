<template>
  <BookDetail :book-data="drawYourThoughtsBook" />
</template>

<script setup>
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

const drawYourThoughtsBook = {
  title: "Draw Your Thoughts",
  image: drawYourThoughtsThumbnail,
  shortDescription: "",
  description:
    "Within this book, diagrams and pictorial symbols-termed here as the visual language-- are extensively and seamlessly employed to depict, formulate, analyse, discuss, think through and solve many diverse problems in equally diverse areas of interest, such as : economics, business management, accounting, project management, decision science, public policy, public finance as well as politics, and surprisingly even religions and metaphysics. This visual thinking handbook will likely open up many new ways of looking at the same old world; and therefore will broaden your perspective and elevate enrich your thought, your work, as well as your mind and ultimately your life. This book is equally useful as a stand - alone read or as accompanying material for training courses on the subject matter",
  additionalInfo1: "",
  additionalInfo2: "",
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
};
</script>
