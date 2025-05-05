<template>
  <BookDetail :book-data="politicsBook" />
</template>

<script setup>
import BookDetail from "@/components/books/BookDetail.vue";
import TyrantThumbnail from "@/assets/images/Tyrant-Handbook-thumbnail.webp";
import theWayOutThumbnail from "@/assets/images/The-Way-Out-thumbnail.webp";
import cleaningUpThailandBook1Thumbnail from "@/assets/images/Cleaning-Up-Thailand-book1-thumbnail.webp";
import cleaningUpThailandBook2Thumbnail from "@/assets/images/Cleaning-Up-Thailand-book2-thumbnail.webp";
import buy01 from "@/assets/images/buy-01.webp";
import buy02 from "@/assets/images/buy-02.webp";
import buy03 from "@/assets/images/buy-03.webp";
import buy04 from "@/assets/images/buy-04.webp";
import buy05 from "@/assets/images/buy-05.webp";

const politicsBook = {
  title: "The Way Out",
  image: theWayOutThumbnail,
  shortDescription:
    "Comprehensive analysis of political systems and effective governance.",
  description:
    "This insightful series examines contemporary political challenges and solutions through a lens of ethical governance and sustainable policy development.",
  additionalInfo1:
    "Drawing from extensive research and real-world case studies, these books offer practical frameworks for addressing complex societal issues.",
  additionalInfo2:
    "Essential reading for policy makers, public administrators, students of political science, and engaged citizens seeking to understand and improve governance systems.",
  series: "Politics & Public Policy Series",
  colorScheme: "red",
  backgroundColor: "red",
  relatedBooks: [
    {
      title: "Tyrant's Handbook",
      image: TyrantThumbnail,
      link: "tyrant-handbook",
    },
    {
      title: "Cleaning Up Thailand Book 1",
      image: cleaningUpThailandBook1Thumbnail,
      link: "cleaning-up-thailand-book-1",
    },
    {
      title: "Cleaning Up Thailand Book 2",
      image: cleaningUpThailandBook2Thumbnail,
      link: "cleaning-up-thailand-book-2",
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
      link: "https://apple.com/books",
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
