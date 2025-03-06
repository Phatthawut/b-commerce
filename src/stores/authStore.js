import { auth, db } from "../firebase/config";
import { defineStore } from "pinia";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Create a Pinia store for authentication
export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.email === "phatthawut.cnx@gmail.com", // Replace with your admin logic
  },

  actions: {
    // Initialize auth state
    async init() {
      return new Promise((resolve, reject) => {
        try {
          const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
              this.user = user;
              unsubscribe();
              resolve(user);
            },
            (error) => {
              this.error = error.message;
              reject(error);
            }
          );
        } catch (error) {
          this.error = error.message;
          reject(error);
        }
      });
    },

    // Register a new user
    async register(email, password, displayName) {
      this.loading = true;
      this.error = null;

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // Update the user profile with display name
        await updateProfile(auth.currentUser, { displayName });

        // Create user document in Firestore
        await this.createUserDocument(userCredential.user, { displayName });

        this.user = userCredential.user;
        return userCredential.user;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Login user with email and password
    async login(email, password) {
      this.loading = true;
      this.error = null;

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        this.user = userCredential.user;
        return userCredential.user;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Login with Google
    async loginWithGoogle() {
      this.loading = true;
      this.error = null;

      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);

        // Check if this is a new user
        const isNewUser = result._tokenResponse.isNewUser;

        if (isNewUser) {
          // Create user document in Firestore for new Google users
          await this.createUserDocument(result.user, {
            displayName: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
          });
        }

        this.user = result.user;
        return result.user;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Create user document in Firestore
    async createUserDocument(user, additionalData = {}) {
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const { displayName, email, photoURL } = user;
        const createdAt = new Date();

        try {
          await setDoc(userRef, {
            displayName,
            email,
            photoURL,
            createdAt,
            ...additionalData,
          });
        } catch (error) {
          console.error("Error creating user document", error);
          this.error = "Error creating user profile";
        }
      }

      return userRef;
    },

    // Logout user
    async logout() {
      this.loading = true;
      this.error = null;

      try {
        await signOut(auth);
        this.user = null;
        return true;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Set error message
    setError(message) {
      this.error = message;
    },

    // Clear error message
    clearError() {
      this.error = null;
    },
  },
});
