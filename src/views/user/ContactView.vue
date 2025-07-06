<template>
  <div
    class="flex flex-col items-center gap-8 mx-auto pt-12 pb-16 bg-white text-black"
  >
    <div class="flex flex-col gap-2 items-center w-full">
      <h3 class="text-4xl font-bold text-center">Contact Us</h3>
      <div class="divider divider-info w-1/2 mx-auto"></div>
    </div>

    <div
      class="gradient-background-donate px-2 py-6 sm:px-4 md:px-8 lg:px-12 w-full"
    >
      <div
        class="w-full max-w-md md:max-w-2xl lg:max-w-3xl mx-auto text-background-blue pt-8 shadow-md rounded px-4"
      >
        <form class="rounded px-2 sm:px-4 md:px-8 pt-6 pb-8 w-full">
          <div class="mb-4">
            <label class="sr-only" for="name"> Full Name </label>
            <input
              class="w-full py-3 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
              id="name"
              type="text"
              placeholder="Full Name"
              v-model="formData.name"
            />
          </div>

          <div class="mb-4">
            <label class="sr-only" for="email"> Email </label>
            <input
              class="w-full py-3 px-3 bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
              id="email"
              type="email"
              placeholder="your.email@example.com"
              v-model="formData.email"
            />
          </div>

          <div class="mb-6">
            <label class="sr-only" for="message"> Message </label>
            <textarea
              class="w-full py-3 px-3 h-[150px] bg-white text-gray-700 leading-tight focus:outline-2 outline-button-blue focus:shadow-outline uppercase"
              id="message"
              placeholder="Your Message"
              v-model="formData.message"
            ></textarea>
          </div>

          <div class="flex flex-col items-stretch sm:flex-row sm:justify-end">
            <button
              class="bg-button-blue hover:bg-button-blue-hover text-white font-bold py-2 px-8 rounded focus:outline-2 outline-button-blue focus:shadow-outline w-full sm:w-auto"
              type="button"
              @click="handleSubmit"
            >
              Send Message
            </button>
          </div>
        </form>
        <div
          class="flex flex-col md:flex-row justify-around items-center pb-8 w-full gap-4"
        >
          <p class="text-[0.7em]">Line official: @woodyprieb</p>
          <p class="text-[0.7em]">facebook: Dharmoscience</p>
          <p class="text-[0.7em]">email: woodyprieb@gmail.com</p>
        </div>
      </div>
      <div class="flex gap-2 justify-center items-center pt-8">
        <a href="https://line.me/R/ti/p/%401234567890" class="link link-hover">
          <i class="fab fa-line text-3xl text-green-600"></i>
        </a>
        <a
          href="https://www.facebook.com/profile.php?id=1000889188889188889"
          class="link link-hover"
        >
          <i class="fab fa-facebook text-3xl text-blue-600"></i>
        </a>
      </div>
    </div>
    <div class="flex flex-col gap-4 items-center">
      <h3 class="text-3xl font-bold">Buy / Download at</h3>
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <img src="@/assets/images/buy-01.webp" alt="buy-01" class="w-12 h-12" />
        <img src="@/assets/images/buy-02.webp" alt="buy-02" class="w-12 h-12" />
        <img src="@/assets/images/buy-03.webp" alt="buy-03" class="w-12 h-12" />
        <img src="@/assets/images/buy-04.webp" alt="buy-04" class="w-12 h-12" />
        <img src="@/assets/images/buy-05.webp" alt="buy-05" class="w-12 h-12" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const formData = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
});

const handleSubmit = () => {
  // Handle form submission here
  console.log("Form submitted:", {
    formType: "contact",
    hasEmail: !!formData.value.email,
    hasName: !!formData.value.name,
    timestamp: new Date().toISOString(),
  });
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
.gradient-background-donate {
  background: linear-gradient(to right, #d9ebec, #cbe5e5);
}
.text-background-blue {
  background: #e8f7f9;
}
</style>
