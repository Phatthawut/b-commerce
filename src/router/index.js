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
					component: () => import("../views/user/Home.vue"),
				},
				{
					path: "/products",
					name: "products",
					component: () => import("../views/user/Products.vue"),
				},
				{
					path: "/cart",
					name: "cart",
					component: () => import("../views/user/Cart.vue"),
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
					component: () => import("../views/admin/Dashboard.vue"),
				},
			],
		},
	],
});

export default router;
