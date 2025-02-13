<template>
	<nav class="bg-blue-300 shadow-md mx-auto w-full">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between gap-8 h-16">
				<div class="hidden md:flex md:items-center md:space-x-4">
					<ul class="flex space-x-4">
						<li>
							<router-link
								to="/"
								class="btn btn-ghost text-gray-600 hover:text-primary"
							>
								<i class="fas fa-home"></i> Home
							</router-link>
						</li>
						<li>
							<router-link
								to="/products"
								class="btn btn-ghost text-gray-600 hover:text-primary"
							>
								<i class="fas fa-box"></i> Products
							</router-link>
						</li>
						<li>
							<router-link
								to="/cart"
								class="btn btn-ghost text-gray-600 hover:text-primary"
							>
								<i class="fas fa-shopping-cart"></i> Cart
							</router-link>
						</li>
					</ul>
				</div>
				<div class="flex md:hidden">
					<button
						@click="toggleMenu"
						class="btn btn-ghost text-gray-600 focus:outline-none"
					>
						<i v-if="!isMenuOpen" class="fas fa-bars"></i>
						<i v-else class="fas fa-times"></i>
					</button>
				</div>
				<div class="flex items-center">
					<h1 class="text-2xl font-bold text-primary">B-Commerce</h1>
				</div>
			</div>
		</div>
		<div v-if="isMenuOpen" class="md:hidden">
			<ul class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
				<li>
					<router-link to="/" class="block text-gray-600 hover:text-primary">
						<i class="fas fa-home"></i> Home
					</router-link>
				</li>
				<li>
					<router-link
						to="/products"
						class="block text-gray-600 hover:text-primary"
					>
						<i class="fas fa-box"></i> Products
					</router-link>
				</li>
				<li>
					<router-link
						to="/cart"
						class="block text-gray-600 hover:text-primary"
					>
						<i class="fas fa-shopping-cart"></i> Cart
					</router-link>
				</li>
			</ul>
		</div>
	</nav>
</template>

<script setup>
import { ref } from "vue";

const isMenuOpen = ref(false);

const toggleMenu = () => {
	isMenuOpen.value = !isMenuOpen.value;
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
