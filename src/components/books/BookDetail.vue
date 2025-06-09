<template>
  <div class="mx-auto font-thai">
    <div :class="bgClass" class="py-24 w-full">
      <!-- Book Images -->
      <div
        class="flex flex-col sm:flex-row justify-center items-center gap-4 mx-auto"
      >
        <div class="flex flex-col items-center w-1/2">
          <img :src="bookData.image" :alt="bookData.title" class="h-auto" />
          <p
            :class="`sr-only text-gray-700 text-center py-8 w-[80%] ${bodyClasses}`"
          >
            {{ bookData.title }}
          </p>
        </div>

        <!-- Book Details -->
        <div
          class="flex flex-col items-center gap-4 w-full sm:w-1/2 md:mr-16 mx-auto"
        >
          <p
            :class="`text-black w-[80%] preserve-whitespace ${bodyClassesWithAlignment}`"
          >
            {{ bookData.shortDescription }}
          </p>
          <p
            :class="`text-black w-[80%] preserve-whitespace ${bodyClassesWithAlignment}`"
          >
            {{ bookData.description }}
          </p>
          <p
            :class="`text-black w-[80%] preserve-whitespace ${bodyClassesWithAlignment}`"
          >
            {{ bookData.additionalInfo1 }}
          </p>
          <p
            :class="`text-black w-[80%] preserve-whitespace ${bodyClassesWithAlignment}`"
          >
            {{ bookData.additionalInfo2 }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="bookData.relatedBooks && bookData.relatedBooks.length > 0"
    class="flex flex-col items-center gap-4 py-16"
    :class="bgdClass"
  >
    <h3
      :class="`text-2xl lg:text-3xl font-semibold text-white mb-6 ${headingClasses}`"
    >
      {{ $t("pages.bookDetail.exploreSeriesTitle") }}
    </h3>
    <div class="flex flex-wrap justify-center gap-12">
      <router-link
        v-for="(book, index) in bookData.relatedBooks"
        :key="index"
        :to="book.link"
        class="flex flex-col items-center gap-4 w-40"
      >
        <img :src="book.image" :alt="book.title" class="w-40 h-auto" />
        <p
          :class="`sr-only text-gray-700 text-center mb-8 w-[80%] ${bodyClasses}`"
        >
          {{ book.title }}
        </p>
      </router-link>
    </div>
  </div>
  <!--where to buy-->
  <div class="flex flex-col gap-4 items-center py-8">
    <h3 :class="`text-3xl font-bold text-black pb-8 ${headingClasses}`">
      {{ $t("pages.ourBooks.buyDownload") }}
    </h3>
    <div class="flex flex-col md:flex-row gap-4 items-center">
      <a
        v-for="(store, index) in bookData.stores || defaultStores"
        :key="index"
        :href="store.link"
        target="_blank"
        class="hover:opacity-80 transition-opacity"
      >
        <img :src="store.image" :alt="store.name" class="w-24 h-24" />
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useDynamicFont } from "@/composables/useDynamicFont";

const { headingClasses, bodyClasses, bodyClassesWithAlignment } =
  useDynamicFont();

const props = defineProps({
  bookData: {
    type: Object,
    required: true,
    default: () => ({
      title: "Dharmascience",
      image: "@/assets/images/dharmoscience-thumbnail.webp",
      shortDescription:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat",
      description:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat",
      additionalInfo1:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat",
      additionalInfo2:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat",
      series: "Dharmoscience Series",
      colorScheme: "red",
      relatedBooks: [
        {
          title: "Neodharma",
          image: "@/assets/images/neodharma-thumbnail.webp",
          link: "/neodharma",
        },
        {
          title: "Sankhara",
          image: "@/assets/images/sankhara-thumbnail.webp",
          link: "/sankhara",
        },
        {
          title: "Nirvana",
          image: "@/assets/images/nirvana-thumbnail.webp",
          link: "/nirvana",
        },
      ],
      stores: [],
    }),
  },
});

const defaultStores = [
  { name: "Store 1", image: "@/assets/images/buy-01.webp", link: "#" },
  { name: "Store 2", image: "@/assets/images/buy-02.webp", link: "#" },
  { name: "Store 3", image: "@/assets/images/buy-03.webp", link: "#" },
  { name: "Store 4", image: "@/assets/images/buy-04.webp", link: "#" },
  { name: "Store 5", image: "@/assets/images/buy-05.webp", link: "#" },
];

const bgClass = computed(() => {
  const colorScheme = props.bookData.colorScheme || "red";
  return `gradient-background-${colorScheme}`;
});

const bgdClass = computed(() => {
  const backgroundColor = props.bookData.backgroundColor || "red";
  return `bg-${backgroundColor}`;
});
</script>

<style scoped>
.gradient-background-teal {
  background: linear-gradient(to right, #e8f7f9, #8ab9bb);
}
.gradient-background-red {
  background: linear-gradient(to right, #f2dddd, #f2c7c7);
}
.gradient-background-purple {
  background: linear-gradient(to right, #e8d9e7, #ceb6cc);
}
.gradient-background-blue {
  background: linear-gradient(to right, #d3e4ea, #9fcadd);
}
.gradient-background-light-blue {
  background: linear-gradient(to right, #d6f2f0, #cef2f1);
}
.text-background-blue {
  background: #f1fcff;
}
.bg-red {
  background: #d97c7c;
}
.bg-purple {
  background: #c6a7c4;
}
.bg-blue {
  background: #91cbdc;
}
.bg-teal {
  background: #9fcecf;
}
.line-blue {
  background: #81c1c6;
}
.border-border-blue {
  border-color: #81c1c6;
}
</style>
