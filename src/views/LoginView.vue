<template>
  <div class="login-view">
    <div class="login-container">
      <div class="logo-container">
        <img
          src="@/assets/logo.webp"
          alt="Woody Prieb Dharmoscience Series Logo"
          class="logo"
        />
        <h1>Woody Prieb Dharmoscience Series</h1>
        <p class="tagline">Donate with purpose, track with ease</p>
      </div>

      <LoginForm
        :redirect-to="redirectPath"
        :mode="mode"
        @login-success="handleLoginSuccess"
        @register-success="handleRegisterSuccess"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import LoginForm from "@/components/LoginForm.vue";
import { useAuthStore } from "@/stores/authStore";

const route = useRoute();
const authStore = useAuthStore();

// Get redirect path from route query or default to home
const redirectPath = ref(route.query.redirect || "/");

// Get mode from route query (login or register)
const mode = ref(route.query.mode || "login");

// Handle successful login
const handleLoginSuccess = (user) => {
  console.log("Login successful:", {
    userId: user.uid,
    email: user.email ? "***" : "Not provided",
    timestamp: new Date().toISOString(),
  });
};

// Handle successful registration
const handleRegisterSuccess = (user) => {
  console.log("Registration successful:", {
    userId: user.uid,
    email: user.email ? "***" : "Not provided",
    timestamp: new Date().toISOString(),
  });
};

// Check if user is already logged in
onMounted(async () => {
  await authStore.initAuth();

  if (authStore.isAuthenticated) {
    // User is already logged in, redirect to the target page
    window.location.href = redirectPath.value;
  }
});
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

@media (min-width: 768px) {
  .login-container {
    flex-direction: row;
    align-items: stretch;
  }

  .logo-container {
    flex: 1;
    padding-right: 40px;
    border-right: 1px solid #e0e0e0;
  }

  .login-form {
    flex: 1;
  }
}

.logo-container {
  text-align: center;
  padding: 20px;
}

.logo {
  width: 120px;
  height: auto;
  margin-bottom: 20px;
}

h1 {
  font-size: 2.5rem;
  color: #4caf50;
  margin-bottom: 10px;
}

.tagline {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 30px;
}
</style>
