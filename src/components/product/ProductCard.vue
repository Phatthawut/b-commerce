<template>
	<div class="bg-white rounded-lg shadow-md overflow-hidden">
		<img
			:src="product.image"
			:alt="product.name"
			class="w-full h-48 object-cover"
		/>
		<div class="p-4">
			<h2 class="text-lg font-semibold text-gray-800">{{ product.name }}</h2>
			<p class="text-gray-600 mt-1">{{ product.description }}</p>
			<div class="mt-4 flex justify-between items-center">
				<span class="text-lg font-bold text-primary">${{ product.price }}</span>
				<button
					class="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
					@click="addToCart"
				>
					Add to Cart
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	product: {
		type: Object,
		required: true,
	},
});

const emit = defineEmits(["add-to-cart"]);

const addToCart = () => {
	emit("add-to-cart", props.product);
};
</script>
