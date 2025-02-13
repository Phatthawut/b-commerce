<template>
	<div class="min-h-screen flex flex-col">
		<div class="max-w-[1440px] mx-auto w-full">
			<TopNav />
			<main class="flex-grow">
				<router-view />
			</main>
		</div>
		<Footer />
	</div>
</template>

<script setup>
import TopNav from "../components/nav/TopNav.vue";
import Footer from "../components/footer/Footer.vue";
</script>
