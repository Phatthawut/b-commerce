<template>
  <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
      Create an Account
    </h2>

    <!-- Error Alert -->
    <div
      v-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
    >
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <form @submit.prevent="handleSubmit">
      <!-- Name Field -->
      <div class="mb-4">
        <label for="name" class="block text-gray-700 text-sm font-bold mb-2"
          >Full Name</label
        >
        <input
          id="name"
          v-model="name"
          type="text"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="John Doe"
          required
        />
      </div>

      <!-- Email Field -->
      <div class="mb-4">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2"
          >Email Address</label
        >
        <input
          id="email"
          v-model="email"
          type="email"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="your@email.com"
          required
        />
      </div>

      <!-- Password Field -->
      <div class="mb-4">
        <label for="password" class="block text-gray-700 text-sm font-bold mb-2"
          >Password</label
        >
        <input
          id="password"
          v-model="password"
          type="password"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="••••••••"
          required
          minlength="6"
        />
      </div>

      <!-- Confirm Password Field -->
      <div class="mb-6">
        <label
          for="confirmPassword"
          class="block text-gray-700 text-sm font-bold mb-2"
          >Confirm Password</label
        >
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="••••••••"
          required
        />
        <p v-if="passwordMismatch" class="text-red-500 text-xs italic mt-1">
          Passwords do not match
        </p>
      </div>

      <!-- Submit Button -->
      <div class="flex items-center justify-between">
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          :disabled="loading || passwordMismatch"
        >
          <span v-if="loading">
            <i class="fas fa-spinner fa-spin mr-2"></i> Creating account...
          </span>
          <span v-else>Register</span>
        </button>
      </div>

      <!-- Login Link -->
      <div class="text-center mt-4">
        <p class="text-sm text-gray-600">
          Already have an account?
          <router-link to="/login" class="text-blue-600 hover:text-blue-800"
            >Login</router-link
          >
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";

const router = useRouter();
const userStore = useUserStore();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const error = ref("");

const passwordMismatch = computed(() => {
  return (
    password.value &&
    confirmPassword.value &&
    password.value !== confirmPassword.value
  );
});

const handleSubmit = async () => {
  if (passwordMismatch.value) {
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    await userStore.register(email.value, password.value, name.value);
    router.push("/");
  } catch (err) {
    error.value = err.message || "Failed to create account. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>
