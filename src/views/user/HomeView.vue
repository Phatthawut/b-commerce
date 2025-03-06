<template>
  <div class="font-thai -mt-2">
    <Hero :imageSrc="heroImage" imageAlt="Home Hero Image" />
    <div
      class="container relative mx-auto md:w-[95%] md:my-6 gradient-background-teal"
    >
      <blockquote
        class="text-xl font-semibold text-gray-900 py-12 flex flex-col items-center px-8 md:w-[50%] mx-auto"
      >
        <div class="flex w-full justify-start mb-4">
          <svg
            class="w-8 h-8 text-blue-500 rotate-180"
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
          Discover the wisdom in learning about how science and buddhism
          beautifully intertwine
        </p>
        <div class="flex w-full justify-end mt-4">
          <svg
            class="w-8 h-8 text-blue-500"
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
            class="flex flex-col items-start gradient-background-blue shadow-md px-4 py-8 -mt-2 w-[90%] md:w-1/2 md:-ml-8 lg:-ml-16"
          >
            <p class="text-gray-600">15 May 2020</p>
            <h2 class="text-2xl font-bold mb-4">The Dharmoscience Series</h2>
            <hr class="w-full px-4 text-blue-400 pt-4" />
            <p class="text-gray-600">
              This four-book series, "Dharmoscience," is an effort to merge
              modern scientific knowledge with ancient dharma into a unified
              framework. The goal is to offer a more comprehensive explanation
              of the ultimate reality of nature. This approach seeks to
              scientifically formulate dharma while simultaneously expanding the
              scope of modern science beyond the limits of materialism.
            </p>
            <button class="bg-blue-500 text-white px-6 py-2 mt-4">
              Learn More
            </button>
          </div>
        </div>
        <div
          class="flex flex-col md:flex-row-reverse md:gap-0 p-4 md:p-0 items-center"
        >
          <div class="bg-purple-300 shadow-md w-full md:w-1/2 p-6">
            <img
              src="@/assets/images/draw-your-thoughts.webp"
              alt="Products image"
              class="w-[80%] lg:w-[50%] mx-auto py-4 object-contain md:h-[400px]"
            />
          </div>
          <div
            class="flex flex-col items-start justify-center text-background-blue shadow-md px-4 py-8 mx-4 -mt-2 w-[90%] md:w-1/2 md:-mr-8 lg:-mr-16 z-10"
          >
            <p class="text-gray-600">15 May 2020</p>
            <h2 class="text-2xl font-bold mb-4">Draw Your Thought</h2>
            <hr class="w-full px-4 text-blue-400 pt-4" />
            <p class="text-gray-600">
              Unlocks the power of visual thinking to solve problems across
              diverse fields, from business and politics to metaphysics. This
              book offers fresh perspectives, enhancing decision-making and
              enriching both work and life.
            </p>
            <button class="button-blue text-white px-6 py-2 mt-4">
              Learn More
            </button>
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
            <p class="text-gray-600">15 May 2020</p>
            <h2 class="text-2xl font-bold mb-4">Products description</h2>
            <div class="divider w-full px-4 line-blue pt-4"></div>
            <p class="text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos. Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Quisquam,
            </p>
            <button class="button-blue text-white px-6 py-2 mt-4">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
    <section class="container mx-auto bg-teal-100 pb-12 md:w-[95%] md:my-6">
      <div class="flex flex-col gap-8">
        <div class="flex flex-col">
          <div class="flex flex-col justify-center items-center pt-8">
            <h3 class="text-2xl font-bold">About the Author</h3>
            <p class="text-gray-600 font-merriweather">
              Dr. Vuthiphong Priebjrivat
            </p>
          </div>
          <div class="pt-4 pb-6 px-8 mx-auto">
            <img
              src="@/assets/images/Dr-Vuthiphong-Priebjrivat.webp"
              alt="Dr.Vuthiphong Priebjrivat"
              class="h-48 object-cover object-right-bottom"
            />
          </div>
          <div
            class="flex flex-col justify-center items-center pt-4 pb-6 px-4 mx-auto -mt-14 w-1/2 bg-teal-50"
          >
            <p class="text-gray-600 font-merriweather text-center">
              Woody Wisdom
            </p>
            <button class="button-blue text-white px-6 py-2 mt-4">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
    <section class="container mx-auto p-4">
      <div class="relative">
        <!-- Top-left border -->
        <div class="absolute bottom-0 left-0">
          <div class="border-l-4 border-teal-500 h-32"></div>
          <div class="border-t-4 border-teal-500 w-32"></div>
        </div>

        <!-- Bottom-right border -->
        <div class="absolute top-0 right-0">
          <div class="border-t-4 border-teal-500 w-32"></div>
          <div class="border-r-4 border-teal-500 h-32"></div>
        </div>

        <!-- Content -->
        <div
          class="flex flex-col justify-center items-center py-12 px-4 bg-blue-50"
        >
          <h3 class="text-xl font-bold mb-2">Join Our Donation Campaign</h3>
          <h3 class="font-light uppercase text-center text-gray-600 max-w-md">
            Learn about the why, where and how of our book donation
          </h3>
          <button
            class="bg-teal-500 hover:bg-teal-600 text-white px-8 py-2 mt-6 rounded-sm"
          >
            Donate Now
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Hero from "@/components/hero/Hero.vue";
import heroImage from "@/assets/images/hero-image.webp";
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
