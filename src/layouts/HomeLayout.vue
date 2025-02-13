<template>
	<div class="min-h-screen flex flex-col max-w-[1440px] mx-auto">
		<TopNav />
		<main class="flex-grow">
			<router-view />
		</main>
		<Footer />
	</div>
</template>

<script setup>
import TopNav from "../components/nav/TopNav.vue";
import Footer from "../components/footer/Footer.vue";
</script>
