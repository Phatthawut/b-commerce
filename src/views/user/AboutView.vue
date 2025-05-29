<template>
  <div class="font-thai -mt-2 bg-white text-black">
    <Hero :imageSrc="heroImage" imageAlt="About Hero Image" />
    <div class="container relative mx-auto px-4 font-thai">
      <div class="flex flex-col items-center gap-8 mx-auto px-4">
        <div>
          <h2 :class="`text-4xl pt-12 ${headingClasses}`">
            {{ $t("pages.about.authorSection.heading") }}
          </h2>
        </div>
        <div class="border-t-2 border-[#8ebcc2] w-64"></div>

        <div class="mx-auto px-6 pt-4 pb-12">
          <div class="relative">
            <!-- Top-left border -->
            <div class="absolute bottom-0 left-0">
              <div class="border-l-4 border-borderline h-32"></div>
              <div class="border-t-4 border-borderline w-32"></div>
            </div>

            <!-- Bottom-right border -->
            <div class="absolute top-0 right-0">
              <div class="border-t-4 border-borderline w-32"></div>
              <div class="border-r-4 border-borderline h-32"></div>
            </div>

            <!-- Content -->
            <div
              class="flex flex-col gap-6 justify-center items-center py-12 px-4 bg-mainbg max-w-[1300px] mx-auto"
            >
              <h2 :class="`text-2xl ${titleClasses}`">
                {{ $t("pages.about.authorSection.name") }}
              </h2>
              <h3 :class="`text-xl mb-2 ${titleClasses}`">
                {{ $t("pages.about.authorSection.fullName") }}
              </h3>
              <p
                :class="`px-4 text-sm md:text-lg preserve-whitespace ${bodyClasses}`"
              >
                {{ $t("pages.about.authorSection.biography.paragraph1") }}
              </p>
              <p
                :class="`px-4 text-sm md:text-lg preserve-whitespace ${bodyClasses}`"
              >
                {{ $t("pages.about.authorSection.biography.paragraph2") }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Hero from "@/components/hero/Hero.vue";
import heroImage from "@/assets/images/Dr-Vuthiphong-Priebjrivat.webp";
import { useDynamicFont } from "@/composables/useDynamicFont";

const { titleClasses, headingClasses, bodyClasses } = useDynamicFont();
</script>
