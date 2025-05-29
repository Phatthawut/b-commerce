<template>
  <div class="font-thai -mt-2 bg-white text-black">
    <div class="container relative mx-auto px-4 font-thai">
      <div class="flex flex-col items-center gap-8 mx-auto px-4">
        <div>
          <h2 :class="`text-4xl font-bold pt-12 ${titleClasses}`">
            {{ $t("pages.services.title") }}
          </h2>
        </div>
        <div class="border-t-2 border-border-blue w-[60%]"></div>
        <div class="flex flex-col gap-2 items-center">
          <h3 :class="`text-3xl font-bold ${headingClasses}`">
            {{ $t("pages.services.talks.title") }}
          </h3>
          <p :class="`md:text-lg ${bodyClasses}`">
            {{ $t("pages.services.talks.subtitle") }}
          </p>
        </div>

        <div class="mx-auto px-6 pt-4 pb-12 w-[95%] md:w-[80%]">
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
              class="flex flex-col justify-center items-center py-12 px-4 text-background-blue"
            >
              <p
                :class="`px-4 text-sm md:text-lg preserve-whitespace ${bodyClassesWithAlignment}`"
              >
                {{ $t("pages.services.talks.description") }}
              </p>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div class="w-full h-full">
            <img src="@/assets/images/service-01.webp" alt="Service 1" />
          </div>
          <div class="w-full h-full">
            <img src="@/assets/images/service-02.webp" alt="Service 2" />
          </div>
          <div class="w-full h-full">
            <img src="@/assets/images/service-03.webp" alt="Service 3" />
          </div>
          <div class="w-full h-full">
            <img src="@/assets/images/service-04.webp" alt="Service 4" />
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center gap-8 mx-auto px-4 pt-12">
        <div class="flex flex-col gap-2 items-center">
          <h3 :class="`text-3xl font-bold ${headingClasses}`">
            {{ $t("pages.services.workshops.title") }}
          </h3>
          <p :class="`md:text-lg ${bodyClasses}`">
            {{ $t("pages.services.workshops.subtitle") }}
          </p>
        </div>

        <div class="mx-auto px-6 pt-4 pb-12 w-[95%] md:w-[80%]">
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
              class="flex flex-col justify-center items-center py-12 px-4 text-background-blue"
            >
              <p
                :class="`px-4 text-sm md:text-lg preserve-whitespace ${bodyClassesWithAlignment}`"
              >
                {{ $t("pages.services.workshops.description") }}
              </p>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div class="w-full h-full">
            <img src="@/assets/images/service-05.webp" alt="Service 5" />
          </div>
          <div class="w-full h-full">
            <img src="@/assets/images/service-06.webp" alt="Service 6" />
          </div>
          <div class="w-full h-full">
            <img src="@/assets/images/service-07.webp" alt="Service 7" />
          </div>
          <div class="w-full h-full">
            <img src="@/assets/images/service-08.webp" alt="Service 8" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center gap-8 mx-auto pt-12 pb-16">
      <div class="flex flex-col gap-2 items-center">
        <h3 :class="`text-3xl font-bold ${headingClasses}`">
          {{ $t("pages.services.contact.title") }}
        </h3>
        <div class="border-t-2 border-border-blue w-[80%]"></div>
      </div>

      <div class="w-full max-w-2xl mx-auto text-background-blue pt-8">
        <div class="flex gap-2 justify-center items-center">
          <a
            href="https://line.me/R/ti/p/%401234567890"
            class="link link-hover"
          >
            <i class="fab fa-line text-3xl text-green-600"></i>
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=1000889188889188889"
            class="link link-hover"
          >
            <i class="fab fa-facebook text-3xl text-blue-600"></i>
          </a>
        </div>
        <form class="shadow-md rounded px-8 pt-6 pb-8">
          <div class="mb-4">
            <label class="sr-only" for="name">{{ $t("forms.name") }}</label>
            <input
              :class="`w-full py-4 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase ${bodyClasses}`"
              id="name"
              type="text"
              :placeholder="$t('pages.services.contact.form.namePlaceholder')"
              v-model="formData.name"
            />
          </div>

          <div class="mb-4">
            <label class="sr-only" for="email">{{ $t("forms.email") }}</label>
            <input
              :class="`w-full py-4 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase ${bodyClasses}`"
              id="email"
              type="email"
              :placeholder="$t('pages.services.contact.form.emailPlaceholder')"
              v-model="formData.email"
            />
          </div>

          <div class="mb-4">
            <label class="sr-only" for="subject">{{
              $t("forms.message")
            }}</label>
            <input
              :class="`w-full py-4 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase ${bodyClasses}`"
              id="subject"
              type="text"
              :placeholder="
                $t('pages.services.contact.form.subjectPlaceholder')
              "
              v-model="formData.subject"
            />
          </div>

          <div class="mb-6">
            <label class="sr-only" for="message">{{
              $t("forms.message")
            }}</label>
            <textarea
              :class="`w-full py-4 px-3 h-[150px] bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase ${bodyClasses}`"
              id="message"
              :placeholder="
                $t('pages.services.contact.form.messagePlaceholder')
              "
              v-model="formData.message"
            ></textarea>
          </div>

          <div class="flex items-center justify-end">
            <button
              :class="`bg-button-blue hover:bg-button-blue-hover text-white font-bold py-2 px-8 rounded focus:outline-2 outline-button-blue focus:shadow-outline ${bodyClasses}`"
              type="button"
              @click="handleSubmit"
            >
              {{ $t("pages.services.contact.form.sendButton") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useDynamicFont } from "@/composables/useDynamicFont";

const { titleClasses, headingClasses, bodyClasses, bodyClassesWithAlignment } =
  useDynamicFont();

const formData = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
});

const handleSubmit = () => {
  // Handle form submission here
  console.log("Form submitted:", formData.value);
  // Reset form after submission
  formData.value = {
    name: "",
    email: "",
    subject: "",
    message: "",
  };
};
</script>

<style scoped>
.text-background-blue {
  background: #e8f7f9;
}
</style>
