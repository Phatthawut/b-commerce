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
  getAuth,
  sendPasswordResetEmail,
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
    return (
      user.value?.email === "phatthawut.cnx@gmail.com" ||
      user.value?.isAdmin === true
    );
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

      return true;
    } catch (err) {
      console.error("Login with Google error:", err);
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Sign in with email and password
  const loginWithEmail = async (email, password) => {
    loading.value = true;
    error.value = "";

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update last login timestamp
      await setDoc(
        doc(db, "users", userCredential.user.uid),
        {
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );

      return true;
    } catch (err) {
      console.error("Login with email error:", err);
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Register with email and password
  const register = async (email, password, displayName, phoneNumber = "") => {
    loading.value = true;
    error.value = "";

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Update profile
      await updateProfile(firebaseUser, { displayName });

      // Create user document in Firestore
      await setDoc(doc(db, "users", firebaseUser.uid), {
        email,
        displayName,
        phoneNumber,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });

      // Also create donor record
      await setDoc(doc(db, "donors", firebaseUser.uid), {
        email,
        name: displayName,
        telephone: phoneNumber,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return true;
    } catch (err) {
      console.error("Registration error:", err);
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    loading.value = true;
    error.value = "";

    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (err) {
      console.error("Password reset error:", err);
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
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

    // Actions
    initAuth,
    loginWithGoogle,
    loginWithEmail,
    register,
    resetPassword,
    logout,
    updateUserProfile,
  };
});
