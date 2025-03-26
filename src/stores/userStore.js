import { defineStore } from "pinia";
import { useAuthStore } from "@/stores/authStore";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.email === "phatthawut.cnx@gmail.com", // Replace with your admin logic
    userPhotoURL: (state) => state.user?.photoURL || null,
  },

  actions: {
    async register(email, password, displayName) {
      this.loading = true;
      this.error = null;

      try {
        const authStore = useAuthStore();
        const user = await authStore.register(email, password, displayName);
        this.user = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        return user;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async login(email, password) {
      this.loading = true;
      this.error = null;

      try {
        const authStore = useAuthStore();
        const user = await authStore.login(email, password);
        this.user = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        return user;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async loginWithGoogle() {
      this.loading = true;
      this.error = null;

      try {
        const authStore = useAuthStore();
        const user = await authStore.loginWithGoogle();
        this.user = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        return user;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;
      this.error = null;

      try {
        const authStore = useAuthStore();
        await authStore.logout();
        this.user = null;
        return true;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async checkAuth() {
      this.loading = true;
      this.error = null;

      try {
        const authStore = useAuthStore();
        await authStore.initAuth();

        const user = authStore.user;

        if (user) {
          this.user = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          };
        } else {
          this.user = null;
        }

        return user;
      } catch (error) {
        console.error("Error checking authentication:", error);
        this.error = error.message;
        this.user = null;
        return null;
      } finally {
        this.loading = false;
      }
    },

    setError(message) {
      this.error = message;
    },
  },
});
