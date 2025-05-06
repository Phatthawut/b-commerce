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
    "Modern science, without a doubt, can be regarded as the pinnacle of human intellectual pursuit. Considering its recent emergence of only four or five hundred years since Galileo or Copernicus, science certainly has made remarkable progress and impact when compared to other intellectual traditions, either religious or secular. Aside from countless products and artifacts only made possible by modern technology, our way of looking at the world is also profoundly influenced by science. With this enormous success, science has become so confident in itself (sometimes bordering on arrogance) that it tends to overlook what other intellectual or spiritual traditions --particularly the age-old wisdom of religions and metaphysics – have to say.",
  description:
    "In another vein, the word dharma in Sanskrit, in its original and strictest sense, does not mean ethics or morality as commonly understood nowadays; but it means nature. The spiritual core of various eastern religions--particularly Buddhism, Taoism, Jainism and Hinduism-- is in fact the pursuit of true understanding of nature and its immutable laws in order for us to reach spiritual enlightenment and liberation. This is also the ultimate mission of science. In this sense, dharma is science; and science is dharma.",
  additionalInfo1:
    "This four-book set is an effort to combine and integrate modern science and age-old dharma into one fuller body of knowledge --dharmoscience-- in order to better describe the ultimate reality of nature. In other words, this is a novel attempt to scientifically formulate dharma; and at the same time broaden the horizon of modern science beyond the confines of the material realm.",
  additionalInfo2:
    "The four books making up this dharmoscience tetralogy are as follows: (1) Neodharma, (2) Dharmascience, (3) Sankhara, and (4) Nirvana. Within these books is where modern science and dharma converge.",
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
