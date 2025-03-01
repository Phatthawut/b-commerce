<template>
	<div class="font-thai -mt-2">
		<div class="container relative mx-auto px-4 font-thai">
			<div class="flex flex-col items-center gap-8 mx-auto px-4">
				<div>
					<h2 class="text-4xl font-bold pt-12">Our Services</h2>
				</div>
				<div class="border-t-2 border-teal-500 w-[60%]"></div>
				<div class="flex flex-col gap-2 items-center">
					<h3 class="text-3xl font-bold">Talks</h3>
					<p class="md:text-lg font-merriweather">
						Lectures / Seminars / Events
					</p>
				</div>

				<div class="mx-auto px-6 pt-4 pb-12 w-[95%] md:w-[80%]">
					<div class="relative">
						<!-- Top-left border -->
						<div class="absolute bottom-0 left-0">
							<div class="border-l-4 border-teal-500 h-32"></div>
							<div class="border-t-4 border-teal-500 w-32"></div>
						</div>

						<!-- Bottom-right border -->
						<div class="absolute top-0 right-0">
							<div class="border-t-4 border-teal-500 w-32"></div>
							<div class="border-r-4 border-teal-500 h-32"></div>
						</div>

						<!-- Content -->
						<div
							class="flex flex-col justify-center items-center py-12 px-4 bg-blue-50"
						>
							<p class="px-4 text-sm md:text-lg">
								Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
								diam nonummy nibh euismod tincidunt ut laoreet dolore magna
								aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
								nostrud exerci tation ullamcorper euismod tincidunt ut laoreet
								dolore magna aliquam erat volutpat. Ut wisi enim ad minim
								veniam, quis nostrud exerci tation
							</p>
						</div>
					</div>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-0">
					<div class="w-full h-full">
						<img src="@/assets/images/service-01.webp" alt="Service 1" />
					</div>
					<div class="w-full h-full">
						<img src="@/assets/images/service-02.webp" alt="Service 2" />
					</div>
					<div class="w-full h-full">
						<img src="@/assets/images/service-03.webp" alt="Service 3" />
					</div>
					<div class="w-full h-full">
						<img src="@/assets/images/service-04.webp" alt="Service 4" />
					</div>
				</div>
			</div>
			<div class="flex flex-col items-center gap-8 mx-auto px-4 pt-12">
				<div class="flex flex-col gap-2 items-center">
					<h3 class="text-3xl font-bold">Workshops</h3>
					<p class="md:text-lg font-merriweather">
						Visual Thinking / Dharmoscience
					</p>
				</div>

				<div class="mx-auto px-6 pt-4 pb-12 w-[95%] md:w-[80%]">
					<div class="relative">
						<!-- Top-left border -->
						<div class="absolute bottom-0 left-0">
							<div class="border-l-4 border-teal-500 h-32"></div>
							<div class="border-t-4 border-teal-500 w-32"></div>
						</div>

						<!-- Bottom-right border -->
						<div class="absolute top-0 right-0">
							<div class="border-t-4 border-teal-500 w-32"></div>
							<div class="border-r-4 border-teal-500 h-32"></div>
						</div>

						<!-- Content -->
						<div
							class="flex flex-col justify-center items-center py-12 px-4 bg-blue-50"
						>
							<p class="px-4 text-sm md:text-lg">
								Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
								diam nonummy nibh euismod tincidunt ut laoreet dolore magna
								aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
								nostrud exerci tation ullamcorper euismod tincidunt ut laoreet
								dolore magna aliquam erat volutpat. Ut wisi enim ad minim
								veniam, quis nostrud exerci tation
							</p>
						</div>
					</div>
				</div>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-0">
					<div class="w-full h-full">
						<img src="@/assets/images/service-05.webp" alt="Service 5" />
					</div>
					<div class="w-full h-full">
						<img src="@/assets/images/service-06.webp" alt="Service 6" />
					</div>
					<div class="w-full h-full">
						<img src="@/assets/images/service-07.webp" alt="Service 7" />
					</div>
					<div class="w-full h-full">
						<img src="@/assets/images/service-08.webp" alt="Service 8" />
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-col items-center gap-8 mx-auto pt-12 pb-16">
			<div class="flex flex-col gap-2 items-center">
				<h3 class="text-3xl font-bold">Contact Us</h3>
				<div class="border-t-2 border-teal-500 w-[80%]"></div>
			</div>

			<div class="w-full max-w-2xl mx-auto bg-blue-50 pt-8">
				<div class="flex gap-2 justify-center items-center">
					<a
						href="https://line.me/R/ti/p/%401234567890"
						class="link link-hover"
					>
						<i class="fab fa-line text-3xl text-green-600"></i>
					</a>
					<a
						href="https://www.facebook.com/profile.php?id=1000889188889188889"
						class="link link-hover"
					>
						<i class="fab fa-facebook text-3xl text-blue-600"></i>
					</a>
				</div>
				<form class="shadow-md rounded px-8 pt-6 pb-8">
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
