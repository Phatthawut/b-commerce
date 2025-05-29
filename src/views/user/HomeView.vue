<template>
  <div class="font-thai -mt-2 bg-white">
    <Hero :imageSrc="heroImage" imageAlt="Home Hero Image" />
    <div
      class="container relative mx-auto md:w-[95%] md:my-6 gradient-background-teal"
    >
      <blockquote
        class="text-xl font-semibold text-gray-900 py-12 flex flex-col items-center px-8 md:w-[50%] mx-auto"
      >
        <div class="flex w-full justify-start mb-4">
          <svg
            class="w-8 h-8 text-quote-blue rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 14"
          >
            <path
              d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"
            />
          </svg>
        </div>
        <p
          class="font-merriweather text-xl md:text-2xl mx-auto text-center w-full"
        >
          {{ $t("pages.home.heroQuote") }}
        </p>
        <div class="flex w-full justify-end mt-4">
          <svg
            class="w-8 h-8 text-quote-blue"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 14"
          >
            <path
              d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"
            />
          </svg>
        </div>
      </blockquote>
    </div>
    <section class="container mx-auto">
      <div class="flex flex-col gap-8">
        <div class="flex flex-col md:flex-row md:gap-0 p-4 md:p-0 items-center">
          <div class="gradient-background-red shadow-md w-full md:w-1/2 p-6">
            <img
              src="@/assets/images/dharmoscience-series.webp"
              alt="Products image"
              class="w-[80%] lg:w-[50%] mx-auto py-4 object-cover"
            />
          </div>
          <div
            class="flex flex-col items-start text-background-blue shadow-md px-4 py-8 w-[90%] md:w-1/2 md:-ml-8 lg:-ml-16"
          >
            <p class="text-black text-xs">
              {{ $t("pages.home.books.dharmoscience.date") }}
            </p>
            <h2 class="text-2xl font-bold text-black">
              {{ $t("pages.home.books.dharmoscience.title") }}
            </h2>
            <div class="divider divider-info my-2"></div>
            <p class="text-black preserve-whitespace">
              {{ $t("pages.home.books.dharmoscience.description") }}
            </p>
            <router-link
              to="/our-book#dharmoscience"
              class="bg-button-blue hover:bg-button-blue-hover text-white px-8 py-4 mt-4"
            >
              {{ $t("buttons.learnMore") }}
            </router-link>
          </div>
        </div>
        <div
          class="flex flex-col md:flex-row-reverse md:gap-0 p-4 md:p-0 items-center"
        >
          <div class="gradient-background-purple shadow-md w-full md:w-1/2 p-6">
            <img
              src="@/assets/images/draw-your-thoughts.webp"
              alt="Products image"
              class="w-[80%] lg:w-[50%] mx-auto py-4 object-contain md:h-[400px]"
            />
          </div>
          <div
            class="flex flex-col items-start justify-center text-background-blue shadow-md px-4 py-8 mx-4 -mt-2 w-[90%] md:w-1/2 md:-mr-8 lg:-mr-16 z-10"
          >
            <p class="text-black text-xs">
              {{ $t("pages.home.books.drawYourThoughts.date") }}
            </p>
            <h2 class="text-2xl font-bold text-black">
              {{ $t("pages.home.books.drawYourThoughts.title") }}
            </h2>
            <div class="divider divider-info my-2"></div>
            <p class="text-black preserve-whitespace">
              {{ $t("pages.home.books.drawYourThoughts.description") }}
            </p>
            <router-link
              to="/our-book#draw-your-thoughts"
              class="bg-button-blue hover:bg-button-blue-hover text-white px-8 py-4 mt-4"
            >
              {{ $t("buttons.learnMore") }}
            </router-link>
          </div>
        </div>
        <div class="flex flex-col md:flex-row md:gap-0 p-4 md:p-0 items-center">
          <div class="gradient-background-blue shadow-md w-full md:w-1/2 p-6">
            <img
              src="@/assets/images/politics-public-policy-series.webp"
              alt="Products image"
              class="w-[80%] lg:w-[50%] mx-auto py-4 object-contain md:h-[400px]"
            />
          </div>
          <div
            class="flex flex-col items-start justify-center text-background-blue shadow-md px-4 py-8 mx-4 -mt-2 w-[90%] md:w-1/2 md:-ml-8 lg:-ml-16"
          >
            <p class="text-black text-xs">
              {{ $t("pages.home.books.politicsPublicPolicy.date") }}
            </p>
            <h2 class="text-2xl font-bold text-black">
              {{ $t("pages.home.books.politicsPublicPolicy.title") }}
            </h2>
            <div class="divider divider-info my-2"></div>
            <p class="text-black preserve-whitespace">
              {{ $t("pages.home.books.politicsPublicPolicy.description") }}
            </p>
            <router-link
              to="/our-book#politics-public-policy"
              class="bg-button-blue hover:bg-button-blue-hover text-white px-8 py-4 mt-4"
            >
              {{ $t("buttons.learnMore") }}
            </router-link>
          </div>
        </div>
      </div>
    </section>
    <section
      class="container mx-auto gradient-background-light-blue pb-12 md:w-[80%] md:my-6"
    >
      <div class="flex flex-col gap-8">
        <div class="flex flex-col">
          <div class="flex flex-col justify-center items-center pt-8">
            <h3 class="text-2xl font-bold text-black">
              {{ $t("pages.home.author.name") }}
            </h3>
            <p class="text-black font-merriweather">
              {{ $t("pages.home.author.fullName") }}
            </p>
          </div>
          <div class="pt-4 pb-6 px-8 mx-auto">
            <img
              src="@/assets/images/Dr-Vuthiphong-Priebjrivat.webp"
              alt="Dr.Vuthiphong Priebjrivat"
              class="h-48 lg:h-72 object-cover object-right-bottom"
            />
          </div>
          <div
            class="flex flex-col justify-center items-center pt-4 pb-6 px-4 mx-auto -mt-14 text-background-blue md:w-1/3"
          >
            <p class="text-black font-montserrat text-center">
              {{ $t("pages.home.author.organization") }}
            </p>
            <router-link
              to="/about"
              class="bg-button-blue hover:bg-button-blue-hover text-white px-6 py-2 mt-4"
            >
              {{ $t("buttons.learnMore") }}
            </router-link>
          </div>
        </div>
      </div>
    </section>
    <section class="container mx-auto p-4">
      <div class="relative">
        <!-- Top-left border -->
        <div class="absolute bottom-0 left-0">
          <div class="border-l-4 border-border-blue h-20"></div>
          <div class="border-t-4 border-border-blue w-48"></div>
        </div>

        <!-- Bottom-right border -->
        <div class="absolute top-0 right-0">
          <div class="border-t-4 border-border-blue w-48"></div>
          <div class="border-r-4 border-border-blue h-20"></div>
        </div>

        <!-- Content -->
        <div
          class="flex flex-col justify-center items-center py-12 px-4 bg-blue-50"
        >
          <h3
            class="text-2xl lg:text-4xl font-semibold mb-2 font-montserrat text-black"
          >
            {{ $t("pages.home.donation.title") }}
          </h3>
          <h3
            class="font-light uppercase text-center text-black max-w-md font-montserrat text-sm lg:text-lg"
          >
            {{ $t("pages.home.donation.subtitle") }}
          </h3>
          <router-link
            to="donation-campaign"
            class="bg-button-blue hover:bg-button-blue-hover text-white px-8 p-4 mt-6"
          >
            {{ $t("buttons.donateNow") }}
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Hero from "@/components/hero/Hero.vue";
import heroImage from "@/assets/images/hero-image.webp";
import { useDynamicFont } from "@/composables/useDynamicFont";

const { titleClasses, headingClasses, bodyClasses } = useDynamicFont();
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
  background: #e8f7f9;
}
.button-blue {
  background: #81c1c6;
}
.line-blue {
  background: #81c1c6;
}
</style>
