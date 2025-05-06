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
  title: "Neodharma",
  image: neodharmaThumb,
  shortDescription: "",
  description:
    "Unarguably, science has long been the authoritative voice in story-telling about practically everything --from the universe to stars and galaxies; the big bang and black holes; atoms and quarks, matter and energy; plants, animals and humans; chromosomes and DNA; body and mind; life and death; etc. This book retells those same stories but from a rather different voice, dharma. After having read the book, those stories may never sound the same again.",
  additionalInfo1: "",
  additionalInfo2: "",
  series: "Dharmoscience Series",
  colorScheme: "blue",
  backgroundColor: "blue",
  relatedBooks: [
    {
      title: "Dharmascience",
      image: dharmoscienceThumbnail,
      link: "dharmascience",
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
