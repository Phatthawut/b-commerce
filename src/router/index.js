import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "@/stores/authStore";

// Import your components for routing
import HomeLayout from "../layouts/HomeLayout.vue";
import AdminLayout from "../layouts/AdminLayout.vue";

// Create a promise to track when auth is ready
let authReady = false;
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    if (authReady) {
      resolve(auth.currentUser);
    } else {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          unsubscribe();
          authReady = true;
          resolve(user);
        },
        reject
      );
    }
  });
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
        top: 100, // offset from top
      };
    }
    return { top: 0 };
  },
  routes: [
    {
      path: "/",
      component: HomeLayout,
      children: [
        {
          path: "",
          name: "home",
          component: () => import("../views/user/HomeView.vue"),
        },
        {
          path: "about",
          name: "about",
          component: () => import("../views/user/AboutView.vue"),
        },
        {
          path: "our-book",
          name: "our-book",
          component: () => import("../views/user/OurBookView.vue"),
          meta: { requiresAuth: false },
        },
        {
          path: "donation-campaign",
          name: "donation-campaign",
          component: () => import("../views/user/DonationCampaignView.vue"),
          meta: { requiresAuth: false },
        },
        {
          path: "donate",
          name: "donate",
          component: () => import("@/views/user/DonationView2.vue"),
          meta: { requiresAuth: false },
        },
        {
          path: "service",
          name: "service",
          component: () => import("../views/user/ServiceView.vue"),
        },
        {
          path: "contact",
          name: "contact",
          component: () => import("../views/user/ContactView.vue"),
        },
        {
          path: "login",
          name: "login",
          component: () => import("@/views/user/LoginView.vue"),
        },
        {
          path: "payment",
          name: "payment",
          component: () => import("../views/user/PaymentView.vue"),
          meta: { requiresAuth: false },
        },
        {
          path: "thank-you",
          name: "thank-you",
          component: () => import("../views/user/ThankYouView.vue"),
          meta: { requiresAuth: false },
        },
        {
          path: "/lookup",
          name: "DonationLookup",
          component: () => import("@/views/user/DonationLookupView.vue"),
          meta: {
            title: "Check Donation Status",
            requiresAuth: false,
          },
        },
      ],
    },
    {
      path: "/book-detail",
      name: "book-detail",
      component: HomeLayout,
      children: [
        {
          path: "dharmascience",
          name: "dharmascience",
          component: () => import("../views/user/DharmascienceDetailView.vue"),
        },
        {
          path: "neodharma",
          name: "neodharma",
          component: () => import("../views/user/NeoDharmaDetailView.vue"),
        },
        {
          path: "sankhara",
          name: "sankhara",
          component: () => import("../views/user/SankharaDetailView.vue"),
        },
        {
          path: "nirvana",
          name: "nirvana",
          component: () => import("../views/user/NirvanaDetailView.vue"),
        },
        {
          path: "draw-your-thoughts",
          name: "draw-your-thoughts",
          component: () =>
            import("../views/user/DrawYourThoughtsDetailView.vue"),
        },
        {
          path: "tyrant-handbook",
          name: "tyrant-handbook",
          component: () => import("../views/user/TyrantDetailView.vue"),
        },
        {
          path: "the-way-out",
          name: "the-way-out",
          component: () => import("../views/user/TheWayOutDetailView.vue"),
        },
        {
          path: "cleaning-up-thailand-book-1",
          name: "cleaning-up-thailand-book-1",
          component: () =>
            import("../views/user/CleanUpThailand01DetailView.vue"),
        },
        {
          path: "cleaning-up-thailand-book-2",
          name: "cleaning-up-thailand-book-2",
          component: () =>
            import("../views/user/CleanUpThailand02DetailView.vue"),
        },
      ],
    },
    {
      path: "/admin",
      component: AdminLayout,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: "",
          name: "admin",
          component: () => import("../views/admin/DashboardView.vue"),
        },
        {
          path: "donations",
          name: "admin-donations",
          component: () => import("../views/admin/DonationsManagementView.vue"),
        },
        {
          path: "donors",
          name: "admin-donors",
          component: () => import("../views/admin/DonorsView.vue"),
        },
        {
          path: "shipments",
          name: "admin-shipments",
          component: () => import("../views/admin/ShipmentsView.vue"),
        },
        {
          path: "recipients",
          name: "admin-recipients",
          component: () => import("../views/admin/RecipientManagementView.vue"),
        },
        {
          path: "selections",
          name: "admin-selections",
          component: () => import("../views/admin/AdminSelectionView.vue"),
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Initialize auth state if not already done
  if (!authStore.user && !authStore.loading) {
    await authStore.initAuth();
  }

  // Wait for auth to initialize
  if (authStore.loading) {
    // You might want to show a loading spinner here
    // For now, we'll just wait for the auth to initialize
    await new Promise((resolve) => {
      const checkLoading = () => {
        if (!authStore.loading) {
          resolve();
        } else {
          setTimeout(checkLoading, 100);
        }
      };
      checkLoading();
    });
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
  const hideForAuth = to.matched.some((record) => record.meta.hideForAuth);

  // Redirect authenticated users away from login/register pages
  if (hideForAuth && authStore.isAuthenticated) {
    next(from.path !== "/" ? { path: from.path } : "/");
    return;
  }

  // Check if route requires authentication
  if (requiresAuth && !authStore.isAuthenticated) {
    next({
      path: "/login",
      query: { redirect: to.fullPath },
    });
    return;
  }

  // Check if route requires admin privileges
  if (requiresAdmin && !authStore.isAdmin) {
    next({ path: "/" });
    return;
  }

  next();
});

export default router;
