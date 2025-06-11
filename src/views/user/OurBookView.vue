<template>
  <div class="bg-white font-thai">
    <div class="container mx-auto">
      <section class="text-center mb-8">
        <h1 :class="titleClass">
          {{ $t("pages.ourBooks.title") }}
        </h1>
        <div class="w-1/2 h-[2px] line-blue mx-auto mb-4"></div>
      </section>
    </div>

    <!-- Dharmoscience Series -->
    <div class="container mx-auto">
      <div class="gradient-background-red py-8 px-4" id="dharmoscience">
        <div class="flex flex-col items-center gap-4 max-w-3xl mx-auto">
          <h3 :class="headingClass">
            {{ $t("pages.ourBooks.series.dharmoscience.title") }}
          </h3>
          <p :class="bodyTextClass">
            {{ $t("pages.ourBooks.series.dharmoscience.description") }}
          </p>
        </div>
        <!-- Book Images -->
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-items-center md:mx-24"
        >
          <div class="flex flex-col items-center gap-4">
            <router-link to="book-detail/neodharma">
              <img
                src="@/assets/images/neodharma-thumbnail.webp"
                alt="Neo Dharma Book 3"
                class="w-40 h-auto"
              />
            </router-link>
            <p
              class="flex flex-col items-center w-full"
              :class="bookTitleClass"
            >
              {{
                $t("pages.ourBooks.series.dharmoscience.books.neodharma.title")
              }}<br />
              <span class="text-sm font-normal" :class="bookSubtitleClass">
                {{
                  $t(
                    "pages.ourBooks.series.dharmoscience.books.neodharma.subtitle"
                  )
                }}
              </span>
            </p>
          </div>
          <div class="flex flex-col items-center gap-4">
            <router-link to="book-detail/dharmascience">
              <img
                src="@/assets/images/dharmoscience-thumbnail.webp"
                alt="Dharmascience Book 1"
                class="w-40 h-auto"
              />
            </router-link>
            <p
              class="flex flex-col items-center w-full"
              :class="bookTitleClass"
            >
              {{
                $t(
                  "pages.ourBooks.series.dharmoscience.books.dharmoscience.title"
                )
              }}<br />
              <span class="text-sm font-normal" :class="bookSubtitleClass">
                {{
                  $t(
                    "pages.ourBooks.series.dharmoscience.books.dharmoscience.subtitle"
                  )
                }}
              </span>
            </p>
          </div>
          <div class="flex flex-col items-center gap-4">
            <router-link to="book-detail/sankhara">
              <img
                src="@/assets/images/sankhara-thumbnail.webp"
                alt="Dharmascience Book 1"
                class="w-40 h-auto"
              />
            </router-link>
            <p
              class="flex flex-col items-center w-full"
              :class="bookTitleClass"
            >
              {{ $t("pages.ourBooks.series.dharmoscience.books.sankhara.title")
              }}<br />
              <span class="text-sm font-normal" :class="bookSubtitleClass">
                {{
                  $t(
                    "pages.ourBooks.series.dharmoscience.books.sankhara.subtitle"
                  )
                }}
              </span>
            </p>
          </div>
          <div class="flex flex-col items-center gap-4">
            <router-link to="book-detail/nirvana">
              <img
                src="@/assets/images/nirvana-thumbnail.webp"
                alt="Nirvana Book 2"
                class="w-40 h-auto"
              />
            </router-link>
            <p
              class="flex flex-col items-center w-full"
              :class="bookTitleClass"
            >
              {{ $t("pages.ourBooks.series.dharmoscience.books.nirvana.title")
              }}<br />
              <span class="text-sm font-normal" :class="bookSubtitleClass">
                {{
                  $t(
                    "pages.ourBooks.series.dharmoscience.books.nirvana.subtitle"
                  )
                }}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- draw your thoughts -->
    <div class="container mx-auto">
      <div class="gradient-background-blue py-8 px-4" id="draw-your-thoughts">
        <div class="flex flex-col items-center gap-4 max-w-3xl mx-auto">
          <h3 :class="headingClass">
            {{ $t("pages.ourBooks.series.drawYourThoughts.title") }}
          </h3>
          <p :class="bodyTextClass">
            {{ $t("pages.ourBooks.series.drawYourThoughts.description") }}
          </p>
        </div>
        <!-- Book Images -->
        <div class="flex flex-wrap justify-center gap-12">
          <div class="flex flex-col items-center gap-4 w-60">
            <router-link to="book-detail/draw-your-thoughts">
              <img
                src="@/assets/images/draw-your-thoughts-thumbnail.webp"
                alt="Draw Your Thoughts Book 1"
                class="w-60 h-auto"
              />
            </router-link>
            <p :class="bookTitleClass">
              {{
                $t(
                  "pages.ourBooks.series.drawYourThoughts.books.drawYourThoughts.title"
                )
              }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Politics & Public Policy Series -->
    <div class="container mx-auto">
      <div
        class="gradient-background-purple py-8 px-4"
        id="politics-public-policy"
      >
        <div class="flex flex-col items-center gap-4 max-w-3xl mx-auto">
          <h3 :class="headingLargeClass">
            {{ $t("pages.ourBooks.series.politicsPublicPolicy.title") }}
          </h3>
          <p :class="bodyTextHiddenClass">
            {{ $t("pages.ourBooks.series.politicsPublicPolicy.description") }}
          </p>
        </div>
        <!-- Book Images -->
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-items-center md:mx-24"
        >
          <div class="flex flex-col items-center gap-4">
            <router-link to="book-detail/tyrant-handbook">
              <img
                src="@/assets/images/Tyrant-Handbook-thumbnail.webp"
                alt="Tyrant's Handbook"
                class="w-40 h-auto"
              />
            </router-link>
            <p :class="bookTitleClass">
              {{
                $t(
                  "pages.ourBooks.series.politicsPublicPolicy.books.tyrantHandbook.title"
                )
              }}
            </p>
          </div>
          <div class="flex flex-col items-center gap-4">
            <router-link to="book-detail/the-way-out">
              <img
                src="@/assets/images/The-Way-Out-thumbnail.webp"
                alt="The Way Out"
                class="w-40 h-auto"
              />
            </router-link>
            <p :class="bookTitleClass">
              {{
                $t(
                  "pages.ourBooks.series.politicsPublicPolicy.books.theWayOut.title"
                )
              }}
            </p>
          </div>
          <div class="flex flex-col items-center gap-4">
            <router-link to="book-detail/cleaning-up-thailand-book-1">
              <img
                src="@/assets/images/Cleaning-Up-Thailand-book1-thumbnail.webp"
                alt="Cleaning Up Thailand Book 1"
                class="w-40 h-auto"
              />
            </router-link>
            <p :class="bookTitleClass">
              {{
                $t(
                  "pages.ourBooks.series.politicsPublicPolicy.books.cleaningUpThailandBook1.title"
                )
              }}
            </p>
          </div>
          <div class="flex flex-col items-center gap-4">
            <router-link to="book-detail/cleaning-up-thailand-book-2">
              <img
                src="@/assets/images/Cleaning-Up-Thailand-book2-thumbnail.webp"
                alt="Cleaning Up Thailand Book 2"
                class="w-40 h-auto"
              />
            </router-link>
            <p :class="bookTitleClass">
              {{
                $t(
                  "pages.ourBooks.series.politicsPublicPolicy.books.cleaningUpThailandBook2.title"
                )
              }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <!--where to buy-->
    <div class="flex flex-col gap-4 items-center py-24">
      <h3 :class="buyTitleClass">
        {{ $t("pages.ourBooks.buyDownload") }}
      </h3>
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <img src="@/assets/images/buy-01.webp" alt="buy-01" class="w-24 h-24" />
        <img src="@/assets/images/buy-02.webp" alt="buy-02" class="w-24 h-24" />
        <img src="@/assets/images/buy-03.webp" alt="buy-03" class="w-24 h-24" />
        <img src="@/assets/images/buy-04.webp" alt="buy-04" class="w-24 h-24" />
        <img src="@/assets/images/buy-05.webp" alt="buy-05" class="w-24 h-24" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useDynamicFont } from "@/composables/useDynamicFont";

const { titleClasses, headingClasses, bodyClasses, bodyClassesWithAlignment } =
  useDynamicFont();

// Computed classes to avoid template literal issues
const titleClass = computed(
  () => "text-4xl font-bold text-gray-800 mt-12 mb-6 " + titleClasses.value
);
const headingClass = computed(
  () =>
    "text-2xl lg:text-3xl font-bold text-gray-800 mb-4 " + headingClasses.value
);
const headingLargeClass = computed(
  () =>
    "text-2xl lg:text-3xl font-bold text-gray-800 mb-8 " + headingClasses.value
);
const bodyTextClass = computed(
  () =>
    "text-gray-700 mb-8 w-[60%] preserve-whitespace " +
    bodyClassesWithAlignment.value
);
const bodyTextHiddenClass = computed(
  () =>
    "text-gray-700 mb-8 w-[60%] hidden preserve-whitespace " +
    bodyClassesWithAlignment.value
);
const bookTitleClass = computed(
  () => "text-gray-700 text-center font-semibold mb-8 " + bodyClasses.value
);
const bookTextClass = computed(
  () => "text-gray-700 text-center mb-8 w-[80%] " + bodyClasses.value
);
const bookSubtitleClass = computed(
  () => "text-gray-700 text-center block mx-auto w-[80%] " + bodyClasses.value
);
const bookSubtitleBoldClass = computed(
  () => "text-gray-700 text-center font-semibold " + bodyClasses.value
);
const bookSubtitleRegularClass = computed(
  () => "text-gray-700 text-center " + bodyClasses.value
);
const buyTitleClass = computed(
  () => "text-3xl font-bold text-black pb-8 " + headingClasses.value
);
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
