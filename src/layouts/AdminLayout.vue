<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="hidden md:flex md:flex-shrink-0">
      <div class="flex flex-col w-64 bg-gray-800">
        <div class="flex items-center h-16 px-4 bg-gray-900">
          <router-link to="/" class="text-xl font-bold text-white">
            Book Donation Admin
          </router-link>
        </div>
        <div class="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
          <nav class="flex-1 space-y-2">
            <router-link
              to="/admin"
              class="flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-gray-700"
              active-class="bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Dashboard
            </router-link>

            <router-link
              to="/admin/donors"
              class="flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-gray-700"
              active-class="bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Donors
            </router-link>

            <router-link
              to="/admin/donations"
              class="flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-gray-700"
              active-class="bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
              Donations
            </router-link>

            <router-link
              to="/admin/shipments"
              class="flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-gray-700"
              active-class="bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              Shipments
            </router-link>

            <router-link
              to="/admin/recipients"
              class="flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-gray-700"
              active-class="bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Recipients
            </router-link>

            <router-link
              to="/admin/selections"
              class="flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-gray-700"
              active-class="bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Admin Selections
            </router-link>
          </nav>

          <div class="mt-auto">
            <button
              @click="logout"
              class="flex items-center w-full px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile menu button -->
    <div class="md:hidden flex items-center p-4 bg-gray-800 text-white">
      <button @click="toggleSidebar" class="mr-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <span class="text-xl font-bold">Book Donation Admin</span>
    </div>

    <!-- Mobile sidebar -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 md:hidden"
      @click="closeSidebar"
    >
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
      <div
        class="fixed inset-y-0 left-0 flex flex-col w-64 bg-gray-800 z-50"
        @click.stop
      >
        <div class="flex items-center justify-between h-16 px-4 bg-gray-900">
          <router-link to="/" class="text-xl font-bold text-white">
            Book Donation Admin
          </router-link>
          <button @click="closeSidebar" class="text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
          <nav class="flex-1 space-y-2">
            <router-link
              to="/admin"
              class="flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-gray-700"
              active-class="bg-gray-700"
              @click="closeSidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Dashboard
            </router-link>

            <!-- Donors -->
            <router-link
              to="/admin/donors"
              class="flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-gray-700"
              active-class="bg-gray-700"
              @click="closeSidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Donors
            </router-link>

            <!-- Donations -->
            <router-link
              to="/admin/donations"
              class="flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-gray-700"
              active-class="bg-gray-700"
              @click="closeSidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
              Donations
            </router-link>

            <!-- Shipments -->
            <router-link
              to="/admin/shipments"
              class="flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-gray-700"
              active-class="bg-gray-700"
              @click="closeSidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
              Shipments
            </router-link>

            <router-link
              to="/admin/recipients"
              class="flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-gray-700"
              active-class="bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Recipients
            </router-link>

            <router-link
              to="/admin/selections"
              class="flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-gray-700"
              active-class="bg-gray-700"
              @click="closeSidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Admin Selections
            </router-link>
          </nav>

          <div class="mt-auto">
            <button
              @click="logout"
              class="flex items-center w-full px-4 py-2 text-sm font-medium text-white rounded-lg hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- Top header -->
      <header class="bg-white shadow-sm">
        <div class="flex items-center justify-between px-6 py-4">
          <h1 class="text-xl font-semibold text-gray-800">
            Book Donation Admin Panel
          </h1>
          <div class="flex items-center">
            <span class="mr-2 text-sm text-gray-600">{{ userName }}</span>
            <div class="relative">
              <button
                @click="toggleUserMenu"
                class="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 focus:outline-none"
              >
                <span class="text-sm font-medium text-gray-600">
                  {{ userInitials }}
                </span>
              </button>
              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
              >
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="userMenuOpen = false"
                >
                  Your Profile
                </router-link>
                <router-link
                  to="/admin/settings"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="userMenuOpen = false"
                >
                  Settings
                </router-link>
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto bg-gray-100">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const sidebarOpen = ref(false);
const userMenuOpen = ref(false);

// User information
const userName = computed(() => {
  return authStore.user?.displayName || "Admin User";
});

const userInitials = computed(() => {
  const name = userName.value;
  if (!name) return "A";

  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
});

// Toggle sidebar for mobile
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const closeSidebar = () => {
  sidebarOpen.value = false;
};

// Toggle user menu
const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};

// Logout function
const logout = async () => {
  try {
    await authStore.logout();
    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
</script>
