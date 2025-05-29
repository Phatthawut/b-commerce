<template>
  <nav class="mx-auto w-full bg-mainbg uppercase">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Mobile Menu Button -->
      <div class="md:hidden bg-mainbg w-full fixed top-0 left-0 px-4 py-2 z-50">
        <button
          @click="toggleMenu"
          class="btn btn-ghost text-gray-600 focus:outline-none bg-transparent hover:text-white"
        >
          <i v-if="!isMenuOpen" class="fas fa-bars"></i>
          <i v-else class="fas fa-times"></i>
        </button>
      </div>

      <div
        class="flex flex-col justify-center items-center mt-10 md:mt-0 md:gap-8 md:py-4"
      >
        <!-- Logo -->
        <div
          class="flex items-center cursor-pointer bg-mainbg h-20 md:h-36"
          @click="navigateTo('/')"
        >
          <img
            src="../../assets/images/logo-woody-prieb.webp"
            alt="Woody Prieb Logo"
            class="w-1/2 mx-auto"
          />
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex md:items-center md:space-x-4 pb-4">
          <ul class="flex xl:space-x-16">
            <li>
              <router-link
                to="/"
                class="text-sm text-gray-600 py-3 px-4 rounded-sm font-semibold hover:bg-[#81c1c6] hover:text-white hover:border-none"
              >
                Home
              </router-link>
            </li>
            <li>
              <router-link
                to="/about"
                class="text-sm text-gray-600 py-3 px-4 rounded-sm font-semibold hover:bg-[#81c1c6] hover:text-white hover:border-none"
              >
                About
              </router-link>
            </li>
            <li>
              <router-link
                to="/our-book"
                class="text-sm text-gray-600 py-3 px-4 rounded-sm font-semibold hover:bg-[#81c1c6] hover:text-white hover:border-none"
              >
                Our Books
              </router-link>
            </li>
            <li>
              <router-link
                to="/service"
                class="text-sm text-gray-600 py-3 px-4 rounded-sm font-semibold hover:bg-[#81c1c6] hover:text-white hover:border-none"
              >
                Our Services
              </router-link>
            </li>
            <li>
              <router-link
                to="/donation-campaign"
                class="text-sm text-gray-600 py-3 px-4 rounded-sm font-semibold hover:bg-[#81c1c6] hover:text-white hover:border-none"
              >
                Donation Campaign
              </router-link>
            </li>
            <li>
              <router-link
                to="/contact"
                class="text-sm text-gray-600 py-3 px-4 rounded-sm font-semibold hover:bg-[#81c1c6] hover:text-white hover:border-none"
              >
                Contact Us
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div
      v-if="isMenuOpen"
      class="md:hidden fixed top-12 left-0 w-[80%] bg-mainbg z-40 w-full"
    >
      <ul class="px-8 pt-2 pb-3 space-y-2 sm:px-4 font-semibold">
        <li>
          <router-link to="/" class="block text-gray-600"> Home </router-link>
        </li>
        <li>
          <router-link to="/about" class="block text-gray-600">
            About
          </router-link>
        </li>
        <li>
          <router-link to="/our-book" class="block text-gray-600">
            Our Books
          </router-link>
        </li>
        <li>
          <router-link to="/service" class="block text-gray-600">
            Our Services
          </router-link>
        </li>
        <li>
          <router-link to="/donation-campaign" class="block text-gray-600">
            Donation Campaign
          </router-link>
        </li>
        <li>
          <router-link to="/contact" class="block text-gray-600">
            Contact Us
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const navigateTo = (path) => {
  router.push(path);
};
</script>

<style scoped>
.nav-link {
  color: #606060;
}
.teal-button:hover {
  color: #81c1c6;
}
</style>
