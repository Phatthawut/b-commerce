import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

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
  history: createWebHistory(),
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
          path: "books",
          name: "books",
          component: () => import("../views/user/BooksView.vue"),
        },
        {
          path: "service",
          name: "service",
          component: () => import("../views/user/ServiceView.vue"),
        },
        {
          path: "donation",
          name: "donation",
          component: () => import("../views/user/DonationView.vue"),
        },
        {
          path: "contact",
          name: "contact",
          component: () => import("../views/user/ContactView.vue"),
        },
        {
          path: "cart",
          name: "cart",
          component: () => import("../views/user/CartView.vue"),
        },
        {
          path: "checkout",
          name: "checkout",
          component: () => import("../views/user/CheckoutView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "orders",
          name: "orders",
          component: () => import("../views/user/OrdersView.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "products",
          name: "products",
          component: () => import("../views/user/ProductsView.vue"),
        },
        {
          path: "product/:id",
          name: "product",
          component: () => import("../views/user/ProductDetailView.vue"),
        },
        {
          path: "login",
          name: "login",
          component: () => import("../views/user/LoginView.vue"),
          meta: { guestOnly: true },
        },
        {
          path: "register",
          name: "register",
          component: () => import("../views/user/RegisterView.vue"),
          meta: { guestOnly: true },
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
          name: "admin-dashboard",
          component: () => import("../views/admin/DashboardView.vue"),
        },
        {
          path: "products",
          name: "admin-products",
          component: () => import("../views/admin/ProductsView.vue"),
        },
        {
          path: "products/new",
          name: "admin-product-new",
          component: () => import("../views/admin/ProductFormView.vue"),
        },
        {
          path: "products/:id/edit",
          name: "admin-product-edit",
          component: () => import("../views/admin/ProductFormView.vue"),
          props: true,
        },
        {
          path: "orders",
          name: "admin-orders",
          component: () => import("../views/admin/OrdersView.vue"),
        },
        {
          path: "orders/:id",
          name: "admin-order-details",
          component: () => import("../views/admin/OrderDetailView.vue"),
          props: true,
        },
      ],
    },
  ],
});

// Navigation guard
router.beforeEach(async (to, from, next) => {
  // Wait for Firebase auth to initialize
  const currentUser = await getCurrentUser();

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
  const guestOnly = to.matched.some((record) => record.meta.guestOnly);

  // Handle routes that require authentication
  if (requiresAuth && !currentUser) {
    next({ name: "login", query: { redirect: to.fullPath } });
    return;
  }

  // Handle routes that require admin privileges
  // You'll need to check if the user is admin in your Firestore database
  if (
    requiresAdmin &&
    (!currentUser || currentUser.email !== "phatthawut.cnx@gmail.com")
  ) {
    next({ name: "home" });
    return;
  }

  // Handle guest-only routes (like login/register)
  if (guestOnly && currentUser) {
    next({ name: "home" });
    return;
  }

  next();
});

export default router;
