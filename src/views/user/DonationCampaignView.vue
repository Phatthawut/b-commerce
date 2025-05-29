<template>
  <div class="bg-white">
    <!-- Hero Section -->
    <div class="container mx-auto">
      <section class="text-center mb-8">
        <h1
          :class="`text-4xl font-bold text-gray-800 mt-12 mb-6 ${titleClasses}`"
        >
          {{ $t("pages.donationCampaign.title") }}
        </h1>
        <div class="w-1/2 h-[2px] line-blue mx-auto mb-4"></div>
        <p :class="`text-xl text-gray-700 italic ${bodyClasses}`">
          {{ $t("pages.donationCampaign.subtitle") }}
        </p>
      </section>

      <!-- Main Book Display Section -->
      <div class="flex flex-col justify-center items-center gap-12 my-12">
        <div class="relative">
          <img
            src="@/assets/images/bookset.webp"
            alt="Book Collection"
            class="max-w-xs md:max-w-sm"
          />
        </div>
        <!-- Donate Button -->
        <div class="flex justify-center">
          <router-link
            to="/donate"
            :class="`button-blue hover:bg-red-600 text-white font-medium py-3 px-8 transition duration-300 ease-in-out ${bodyClasses}`"
          >
            {{ $t("buttons.donateNow") }}
          </router-link>
        </div>
      </div>

      <!-- Our Objectives Section -->
      <section class="w-full mx-auto py-8">
        <h3
          :class="`text-center text-2xl lg:text-4xl font-semibold mb-2 text-black pb-8 ${headingClasses}`"
        >
          {{ $t("pages.donationCampaign.objectives.title") }}
        </h3>
        <div class="relative mx-auto w-[90%] lg:w-[60%]">
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
          <div class="flex flex-col py-12 px-4 text-background-blue">
            <!-- Objective 1 -->
            <div class="flex pt-8 pb-10 pr-12">
              <div class="w-1/4 text-right pr-8">
                <span class="text-4xl font-bold text-gray-800">01</span>
              </div>
              <div class="w-3/4">
                <h3
                  :class="`text-xl font-semibold text-gray-800 mb-2 ${headingClasses}`"
                >
                  {{ $t("pages.donationCampaign.objectives.objective1.title") }}
                </h3>
                <p :class="`text-gray-600 ${bodyClassesWithAlignment}`">
                  {{
                    $t(
                      "pages.donationCampaign.objectives.objective1.description"
                    )
                  }}
                </p>
              </div>
            </div>

            <!-- Objective 2 -->
            <div class="flex pb-10 pr-12">
              <div class="w-1/4 text-right pr-8">
                <span class="text-4xl font-bold text-gray-800">02</span>
              </div>
              <div class="w-3/4">
                <h3
                  :class="`text-xl font-semibold text-gray-800 mb-2 ${headingClasses}`"
                >
                  {{ $t("pages.donationCampaign.objectives.objective2.title") }}
                </h3>
                <p :class="`text-gray-600 ${bodyClassesWithAlignment}`">
                  {{
                    $t(
                      "pages.donationCampaign.objectives.objective2.description"
                    )
                  }}
                </p>
              </div>
            </div>

            <!-- Objective 3 -->
            <div class="flex pb-10 pr-12">
              <div class="w-1/4 text-right pr-8">
                <span class="text-4xl font-bold text-gray-800">03</span>
              </div>
              <div class="w-3/4">
                <h3
                  :class="`text-xl font-semibold text-gray-800 mb-2 ${headingClasses}`"
                >
                  {{ $t("pages.donationCampaign.objectives.objective3.title") }}
                </h3>
                <p :class="`text-gray-600 ${bodyClassesWithAlignment}`">
                  {{
                    $t(
                      "pages.donationCampaign.objectives.objective3.description"
                    )
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Dharmoscience Series Section - Full width to extend to edge -->
    <section class="mx-auto pt-16">
      <div class="container mx-auto">
        <div class="flex flex-col items-center gap-4 py-12">
          <h2
            :class="`text-2xl lg:text-4xl font-bold text-black text-center ${titleClasses}`"
          >
            {{ $t("pages.donationCampaign.dharmoscienceSeries.title") }}
          </h2>
          <p :class="`text-xl italic text-black text-center ${bodyClasses}`">
            {{ $t("pages.donationCampaign.dharmoscienceSeries.subtitle") }}
          </p>
        </div>
        <div class="gradient-background-red py-16 px-4">
          <div class="max-w-3xl mx-auto">
            <p
              :class="`text-gray-700 text-center mb-8 preserve-whitespace ${bodyClassesWithAlignment}`"
            >
              {{ $t("pages.donationCampaign.dharmoscienceSeries.description") }}
            </p>

            <!-- Book Images -->
            <div class="flex flex-wrap justify-center gap-4 mb-12">
              <router-link to="book-detail/neodharma">
                <img
                  src="@/assets/images/neodharma-thumbnail.webp"
                  alt="Dharmascience Book 3"
                  class="w-40 h-auto"
                />
              </router-link>
              <router-link to="book-detail/dharmascience">
                <img
                  src="@/assets/images/dharmoscience-thumbnail.webp"
                  alt="Dharmascience Book 1"
                  class="w-40 h-auto"
                />
              </router-link>
              <router-link to="book-detail/sankhara">
                <img
                  src="@/assets/images/sankhara-thumbnail.webp"
                  alt="Dharmascience Book 4"
                  class="w-40 h-auto"
                />
              </router-link>
              <router-link to="book-detail/nirvana">
                <img
                  src="@/assets/images/nirvana-thumbnail.webp"
                  alt="Dharmascience Book 2"
                  class="w-40 h-auto"
                />
              </router-link>
            </div>

            <!-- Donate Button -->
            <div class="flex pt-12 justify-center">
              <router-link
                to="/donate"
                :class="`button-red hover:button-red-hover text-white font-medium py-3 px-8 transition duration-300 ease-in-out ${bodyClasses}`"
              >
                {{ $t("buttons.donateNow") }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useDynamicFont } from "@/composables/useDynamicFont";

const { titleClasses, headingClasses, bodyClasses, bodyClassesWithAlignment } =
  useDynamicFont();
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
.button-blue {
  background: #81c1c6;
}
.button-blue:hover {
  background: #61a1a6;
}
.button-red {
  background: #ca807f;
}
.button-red:hover {
  background: #aa6d6d;
}
.line-blue {
  background: #81c1c6;
}
.border-border-blue {
  border-color: #81c1c6;
}
</style>
