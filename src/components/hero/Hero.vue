<template>
	<div class="hero bg-blue-50 mt-2 md:mt-0">
		<div class="hero-content mx-auto">
			<div class="flex-1">
				<img :src="imageSrc" :alt="imageAlt" class="cover-image" />
			</div>
		</div>
	</div>
</template>

<script setup>
defineProps({
	imageSrc: {
		type: String,
		required: true,
	},
	imageAlt: {
		type: String,
		default: "Hero Image",
	},
});
</script>
