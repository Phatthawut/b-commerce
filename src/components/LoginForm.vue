<template>
  <div class="login-form">
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>{{ loadingMessage }}</p>
    </div>

    <div class="auth-container">
      <h2 class="auth-title">{{ isRegister ? "Create Account" : "Login" }}</h2>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Google Sign In Button -->
      <button @click="loginWithGoogle" class="google-btn" :disabled="loading">
        <img src="@/assets/google-icon.svg" alt="Google" class="google-icon" />
        <span>{{
          isRegister ? "Sign up with Google" : "Sign in with Google"
        }}</span>
      </button>

      <div class="divider">
        <span>or</span>
      </div>

      <!-- Email/Password Form -->
      <form @submit.prevent="submitForm">
        <div class="form-group" v-if="isRegister">
          <label for="displayName">Full Name</label>
          <input
            type="text"
            id="displayName"
            v-model="form.displayName"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-input">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="form.password"
              required
              :disabled="loading"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <div class="form-group" v-if="isRegister">
          <label for="phoneNumber">Phone Number (optional)</label>
          <input
            type="tel"
            id="phoneNumber"
            v-model="form.phoneNumber"
            :disabled="loading"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ isRegister ? "Create Account" : "Login" }}
          </button>
        </div>
      </form>

      <div class="auth-footer">
        <p v-if="!isRegister">
          Don't have an account?
          <a href="#" @click.prevent="toggleMode">Sign up</a>
        </p>
        <p v-else>
          Already have an account?
          <a href="#" @click.prevent="toggleMode">Sign in</a>
        </p>
        <p v-if="!isRegister">
          <a href="#" @click.prevent="showResetPassword = true"
            >Forgot password?</a
          >
        </p>
      </div>
    </div>

    <!-- Password Reset Modal -->
    <div v-if="showResetPassword" class="modal">
      <div class="modal-content">
        <span class="close" @click="showResetPassword = false">&times;</span>
        <h3>Reset Password</h3>
        <p>
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <div v-if="resetError" class="error-message">
          {{ resetError }}
        </div>

        <div v-if="resetSuccess" class="success-message">
          Password reset email sent! Check your inbox.
        </div>

        <form @submit.prevent="resetPassword">
          <div class="form-group">
            <label for="resetEmail">Email</label>
            <input
              type="email"
              id="resetEmail"
              v-model="resetEmail"
              required
              :disabled="resetLoading"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="submit-btn" :disabled="resetLoading">
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const props = defineProps({
  redirectTo: {
    type: String,
    default: "/",
  },
  mode: {
    type: String,
    default: "login", // 'login' or 'register'
  },
});

const emit = defineEmits(["login-success", "register-success"]);

const authStore = useAuthStore();
const router = useRouter();

// Form state
const isRegister = ref(props.mode === "register");
const loading = ref(false);
const loadingMessage = ref("Processing...");
const error = ref("");
const showPassword = ref(false);

const form = ref({
  displayName: "",
  email: "",
  password: "",
  phoneNumber: "",
});

// Password reset state
const showResetPassword = ref(false);
const resetEmail = ref("");
const resetLoading = ref(false);
const resetError = ref("");
const resetSuccess = ref(false);

// Toggle between login and register modes
const toggleMode = () => {
  isRegister.value = !isRegister.value;
  error.value = "";
};

// Login with Google
const loginWithGoogle = async () => {
  loading.value = true;
  loadingMessage.value = "Connecting to Google...";
  error.value = "";

  try {
    const success = await authStore.loginWithGoogle();

    if (success) {
      emit("login-success", authStore.user);
      router.push(props.redirectTo);
    } else {
      error.value =
        authStore.error || "Failed to login with Google. Please try again.";
    }
  } catch (err) {
    console.error("Google login error:", err);
    error.value =
      err.message || "An unexpected error occurred. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Submit form (login or register)
const submitForm = async () => {
  loading.value = true;
  error.value = "";

  try {
    if (isRegister.value) {
      // Register new user
      loadingMessage.value = "Creating your account...";

      const success = await authStore.register(
        form.value.email,
        form.value.password,
        form.value.displayName,
        form.value.phoneNumber
      );

      if (success) {
        emit("register-success", authStore.user);
        router.push(props.redirectTo);
      } else {
        error.value =
          authStore.error || "Failed to create account. Please try again.";
      }
    } else {
      // Login existing user
      loadingMessage.value = "Logging in...";

      const success = await authStore.loginWithEmail(
        form.value.email,
        form.value.password
      );

      if (success) {
        emit("login-success", authStore.user);
        router.push(props.redirectTo);
      } else {
        error.value = authStore.error || "Invalid email or password.";
      }
    }
  } catch (err) {
    console.error("Authentication error:", err);
    error.value =
      err.message || "An unexpected error occurred. Please try again.";
  } finally {
    loading.value = false;
  }
};

// Reset password
const resetPassword = async () => {
  resetLoading.value = true;
  resetError.value = "";
  resetSuccess.value = false;

  try {
    const success = await authStore.resetPassword(resetEmail.value);

    if (success) {
      resetSuccess.value = true;
      // Close the modal after 3 seconds
      setTimeout(() => {
        showResetPassword.value = false;
        resetEmail.value = "";
      }, 3000);
    } else {
      resetError.value =
        authStore.error || "Failed to send reset email. Please try again.";
    }
  } catch (err) {
    console.error("Password reset error:", err);
    resetError.value =
      err.message || "An unexpected error occurred. Please try again.";
  } finally {
    resetLoading.value = false;
  }
};
</script>

<style scoped>
.login-form {
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  padding: 20px;
}

.auth-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.auth-title {
  text-align: center;
  margin-bottom: 24px;
  color: #333;
  font-size: 1.8rem;
}

.error-message {
  background-color: #ffebee;
  color: #d32f2f;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.success-message {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.google-btn:hover {
  background-color: #f5f5f5;
}

.google-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.google-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.divider span {
  padding: 0 10px;
  color: #777;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #777;
}

.form-actions {
  margin-top: 24px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #43a047;
}

.submit-btn:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 24px;
  text-align: center;
  font-size: 0.9rem;
}

.auth-footer a {
  color: #4caf50;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  position: relative;
}

.close {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
  color: #777;
}

/* Loading overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #4caf50;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
