<template>
	<div class="flex flex-col items-center gap-8 mx-auto pt-12 pb-16">
		<div class="flex flex-col gap-2 items-center w-full">
			<h3 class="text-3xl font-bold">Contact Us</h3>
			<div class="border-t-2 border-teal-500 w-[70%]"></div>
		</div>

		<div class="bg-blue-100 p-12 w-[90%]">
			<div class="w-full max-w-3xl mx-auto bg-blue-50 pt-8 shadow-md">
				<form class="rounded px-8 pt-6 pb-8">
					<div class="mb-4">
						<label
							class="block text-gray-700 text-sm font-bold mb-2"
							for="name"
						>
							Name
						</label>
						<input
							class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="name"
							type="text"
							placeholder="Your Name"
							v-model="formData.name"
						/>
					</div>

					<div class="mb-4">
						<label
							class="block text-gray-700 text-sm font-bold mb-2"
							for="email"
						>
							Email
						</label>
						<input
							class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="email"
							type="email"
							placeholder="your.email@example.com"
							v-model="formData.email"
						/>
					</div>

					<div class="mb-4">
						<label
							class="block text-gray-700 text-sm font-bold mb-2"
							for="subject"
						>
							Subject
						</label>
						<input
							class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="subject"
							type="text"
							placeholder="Message Subject"
							v-model="formData.subject"
						/>
					</div>

					<div class="mb-6">
						<label
							class="block text-gray-700 text-sm font-bold mb-2"
							for="message"
						>
							Message
						</label>
						<textarea
							class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
							id="message"
							placeholder="Your Message"
							v-model="formData.message"
						></textarea>
					</div>

					<div class="flex items-center justify-center">
						<button
							class="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline"
							type="button"
							@click="handleSubmit"
						>
							Send Message
						</button>
					</div>
				</form>
				<div
					class="flex flex-col md:flex-row justify-around items-center pb-8 w-full gap-4"
				>
					<p class="text-[0.7em]">Line official: @woodyprieb</p>
					<p class="text-[0.7em]">facebook: Dharmoscience</p>
					<p class="text-[0.7em]">email: woodyprieb@gmail.com</p>
				</div>
			</div>
			<div class="flex gap-2 justify-center items-center pt-8">
				<a href="https://line.me/R/ti/p/%401234567890" class="link link-hover">
					<i class="fab fa-line text-3xl text-green-600"></i>
				</a>
				<a
					href="https://www.facebook.com/profile.php?id=1000889188889188889"
					class="link link-hover"
				>
					<i class="fab fa-facebook text-3xl text-blue-600"></i>
				</a>
			</div>
		</div>
		<div class="flex flex-col gap-4 items-center">
			<h3 class="text-3xl font-bold">Buy / Download at</h3>
			<div class="flex flex-col md:flex-row gap-4 items-center">
				<img
					src="../../assets/images/buy-01.webp"
					alt="buy-01"
					class="w-12 h-12"
				/>
				<img
					src="../../assets/images/buy-02.webp"
					alt="buy-02"
					class="w-12 h-12"
				/>
				<img
					src="../../assets/images/buy-03.webp"
					alt="buy-03"
					class="w-12 h-12"
				/>
				<img
					src="../../assets/images/buy-04.webp"
					alt="buy-04"
					class="w-12 h-12"
				/>
				<img
					src="../../assets/images/buy-05.webp"
					alt="buy-05"
					class="w-12 h-12"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";

const formData = ref({
	name: "",
	email: "",
	subject: "",
	message: "",
});

const handleSubmit = () => {
	// Handle form submission here
	console.log("Form submitted:", formData.value);
	// Reset form after submission
	formData.value = {
		name: "",
		email: "",
		subject: "",
		message: "",
	};
};
</script>
