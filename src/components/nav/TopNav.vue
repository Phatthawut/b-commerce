<template>
	<nav class="mx-auto w-full bg-[#f3feff] uppercase">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Mobile Menu Button -->
			<div
				class="md:hidden bg-[#f3feff] w-full fixed top-0 left-0 px-4 py-2 z-50"
			>
				<button
					@click="toggleMenu"
					class="btn btn-ghost text-gray-600 focus:outline-none"
				>
					<i v-if="!isMenuOpen" class="fas fa-bars"></i>
					<i v-else class="fas fa-times"></i>
				</button>
			</div>

			<div
				class="flex flex-col justify-center items-center mt-10 md:mt-0 md:gap-8 md:py-4"
			>
				<!-- Logo -->
				<div
					class="flex items-center cursor-pointer bg-[#f3feff] h-20 md:h-36"
					@click="navigateTo('/')"
				>
					<img
						src="../../assets/images/logo-woody-prieb.webp"
						alt="Woody Prieb Logo"
						class="w-1/2 mx-auto"
					/>
				</div>

				<!-- Desktop Menu -->
				<div class="hidden md:flex md:items-center md:space-x-4">
					<ul class="flex space-x-4 md:space-x-8 lg:space-x-12 xl:space-x-16">
						<li>
							<router-link
								to="/"
								class="btn btn-ghost text-gray-600 hover:text-primary"
							>
								Home
							</router-link>
						</li>
						<li>
							<router-link
								to="/about"
								class="btn btn-ghost text-gray-600 hover:text-primary"
							>
								About
							</router-link>
						</li>
						<li>
							<router-link
								to="/books"
								class="btn btn-ghost text-gray-600 hover:text-primary"
							>
								Our Book
							</router-link>
						</li>
						<li>
							<router-link
								to="/service"
								class="btn btn-ghost text-gray-600 hover:text-primary"
							>
								Our Service
							</router-link>
						</li>
						<li>
							<router-link
								to="/donation"
								class="btn btn-ghost text-gray-600 hover:text-primary"
							>
								Donation Campaign
							</router-link>
						</li>
						<li>
							<router-link
								to="/contact"
								class="btn btn-ghost text-gray-600 hover:text-primary"
							>
								Contact Us
							</router-link>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Mobile Menu -->
		<div
			v-if="isMenuOpen"
			class="md:hidden fixed top-12 left-0 w-[80%] bg-[#f3feff] z-40"
		>
			<ul class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
				<li>
					<router-link
						to="/"
						class="block text-gray-600 hover:text-primary p-2"
					>
						Home
					</router-link>
				</li>
				<li>
					<router-link
						to="/about"
						class="block text-gray-600 hover:text-primary p-2"
					>
						About
					</router-link>
				</li>
				<li>
					<router-link
						to="/books"
						class="block text-gray-600 hover:text-primary p-2"
					>
						Our Book
					</router-link>
				</li>
				<li>
					<router-link
						to="/service"
						class="block text-gray-600 hover:text-primary p-2"
					>
						Our Service
					</router-link>
				</li>
				<li>
					<router-link
						to="/donation"
						class="block text-gray-600 hover:text-primary p-2"
					>
						Donation Campaign
					</router-link>
				</li>
				<li>
					<router-link
						to="/contact"
						class="block text-gray-600 hover:text-primary p-2"
					>
						Contact Us
					</router-link>
				</li>
			</ul>
		</div>
	</nav>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isMenuOpen = ref(false);

const toggleMenu = () => {
	isMenuOpen.value = !isMenuOpen.value;
};

const navigateTo = (path) => {
	router.push(path);
};
</script>

<style scoped></style>
