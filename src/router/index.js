import { createRouter, createWebHistory } from "vue-router";

// Import your components for routing
import HomeLayout from "../layouts/HomeLayout.vue";
import AdminLayout from "../layouts/AdminLayout.vue";

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
			],
		},
		{
			path: "/admin",
			component: AdminLayout,
			children: [
				{
					path: "",
					name: "admin-dashboard",
					component: () => import("../views/admin/DashboardView.vue"),
				},
			],
		},
	],
});

export default router;
