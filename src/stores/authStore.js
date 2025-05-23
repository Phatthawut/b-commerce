import { auth, db } from "../firebase/config";
import { defineStore } from "pinia";
import {
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { ref, computed } from "vue";

// Create a Pinia store for authentication
export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref(null);
  const loading = ref(true);
  const error = ref("");
  const auth = getAuth();

  // Getters
  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => {
    const allowedEmails = import.meta.env.VITE_ALLOWED_EMAILS?.split(",") || [];
    return user.value?.email && allowedEmails.includes(user.value.email);
  });
  const adminFirstName = computed(() => {
    if (!user.value?.displayName) return "Admin";
    // Extract first name from display name (e.g., "John Doe" -> "John")
    return user.value.displayName.split(" ")[0] || "Admin";
  });

  // Initialize auth state
  const initAuth = () => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        loading.value = true;

        if (firebaseUser) {
          // Get additional user data from Firestore
          try {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

            user.value = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              phoneNumber: firebaseUser.phoneNumber,
              ...(userDoc.exists() ? userDoc.data() : {}),
            };
          } catch (err) {
            console.error("Error fetching user data:", err);
            user.value = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              phoneNumber: firebaseUser.phoneNumber,
            };
          }
        } else {
          user.value = null;
        }

        loading.value = false;
        resolve(user.value);
        unsubscribe();
      });
    });
  };

  // Sign in with Google
  const loginWithGoogle = async () => {
    loading.value = true;
    error.value = "";

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Check if user's email is allowed
      const allowedEmails =
        import.meta.env.VITE_ALLOWED_EMAILS?.split(",") || [];
      if (!allowedEmails.includes(firebaseUser.email)) {
        // Sign out the user immediately
        await signOut(auth);
        throw new Error(
          "Access denied. Please contact administrator for access."
        );
      }

      // Create or update user document in Firestore
      await setDoc(
        doc(db, "users", firebaseUser.uid),
        {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          phoneNumber: firebaseUser.phoneNumber,
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Also create or update donor record
      await setDoc(
        doc(db, "donors", firebaseUser.uid),
        {
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          telephone: firebaseUser.phoneNumber || "",
          lastLogin: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Update the user state
      user.value = firebaseUser;

      // Return the user object
      return firebaseUser;
    } catch (err) {
      console.error("Login with Google error:", err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      user.value = null;
      return true;
    } catch (err) {
      console.error("Logout error:", err);
      error.value = err.message;
      return false;
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    if (!user.value) return false;

    loading.value = true;
    error.value = "";

    try {
      const userRef = doc(db, "users", user.value.uid);

      // Update Firestore user document
      await setDoc(
        userRef,
        {
          ...profileData,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Update donor document as well
      const donorRef = doc(db, "donors", user.value.uid);
      await setDoc(
        donorRef,
        {
          name: profileData.displayName,
          email: profileData.email,
          telephone: profileData.phoneNumber,
          address: profileData.address,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Update local user state
      user.value = {
        ...user.value,
        ...profileData,
      };

      return true;
    } catch (err) {
      console.error("Profile update error:", err);
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    user,
    loading,
    error,

    // Getters
    isAuthenticated,
    isAdmin,
    adminFirstName,

    // Actions
    initAuth,
    loginWithGoogle,
    logout,
    updateUserProfile,
  };
});
