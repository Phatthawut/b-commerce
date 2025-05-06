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
  title: "Sankhara",
  image: sankharaThumb,
  shortDescription: "",
  description:
    "This book challenges the predominantly analysis-based perspective of today's science in explaining the ultimate reality of nature. It does so by reintroducing an ancient yet amazingly powerful concept from eastern religions and philosophy called sankhara in plain scientific formulation. A Pali word, sankhara denotes the act of joining the various pertinent parts into a complete and functional whole. When properly assembled, the whole exhibits brand new qualities that were nonexistent before. Sankhara is therefore the logical bedrocks of the holistic worldview. Hopefully, the sankhara worldview would provoke and at the same time enrich the mainstream scientific mindset, which is largely reductionist and narrowly focused on the material aspect of nature.",
  additionalInfo1: "",
  additionalInfo2: "",
  series: "Dharmoscience Series",
  colorScheme: "teal",
  backgroundColor: "teal",
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
