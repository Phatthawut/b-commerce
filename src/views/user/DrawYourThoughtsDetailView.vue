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
  shortDescription:
    "A creative journey through visualization and mindfulness techniques.",
  description:
    "Draw Your Thoughts is a unique approach to mindfulness and self-discovery through visual thinking. This innovative book guides readers on a journey of self-expression and clarity, using drawing as a tool for deeper understanding.",
  additionalInfo1:
    "Suitable for all skill levels - no artistic experience required. The focus is on the process rather than the artistic outcome.",
  additionalInfo2:
    "Includes practical exercises, guided visualizations, and techniques that can be applied in daily life for stress reduction, problem-solving, and creative thinking.",
  series: "Mindfulness Series",
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
