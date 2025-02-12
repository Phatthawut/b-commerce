<script setup>
// Component logic will go here
</script>

<template>
	<div class="min-h-screen">
		<!-- Navigation -->
		<nav class="bg-white shadow-md">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div class="flex justify-between h-16">
					<div class="flex items-center">
						<h1 class="text-2xl font-bold text-primary">B-Commerce</h1>
					</div>
					<div class="flex items-center space-x-4">
						<a href="#" class="text-gray-600 hover:text-primary">Home</a>
						<a href="#" class="text-gray-600 hover:text-primary">Products</a>
						<a href="#" class="text-gray-600 hover:text-primary">Cart (0)</a>
					</div>
				</div>
			</div>
		</nav>

		<!-- Main Content -->
		<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
				<!-- Product Cards will go here -->
			</div>
		</main>
	</div>
</template>

<style scoped>
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}
.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
