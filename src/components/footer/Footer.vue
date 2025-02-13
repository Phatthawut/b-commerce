<template>
	<div class="w-full bg-blue-50 mx-auto">
		<footer class="footer py-8">
			<div class="grid grid-cols-2 md:grid-cols-2 gap-6 mx-auto px-6">
				<div
					class="flex items-start pt-4 cursor-pointer"
					@click="navigateTo('/')"
				>
					<img
						src="../../assets/images/logo-woody-prieb.webp"
						alt="Woody Prieb Logo"
						class="w-2/3 lg:w-1/2 mx-auto"
					/>
				</div>
				<div class="flex flex-col md:flex-row gap-2 md:gap-8">
					<nav>
						<header class="footer-title font-bold py-2">Quick Links</header>
						<div class="flex flex-col gap-2">
							<router-link to="/" class="link link-hover">Home</router-link>
							<router-link to="/about" class="link link-hover"
								>About</router-link
							>
							<router-link to="/books" class="link link-hover"
								>Our Book</router-link
							>
							<router-link to="/service" class="link link-hover"
								>Our Service</router-link
							>
							<router-link to="/donation" class="link link-hover"
								>Donation Campaign</router-link
							>
						</div>
					</nav>
					<nav>
						<header class="footer-title font-bold py-2">Get in touch</header>
						<div class="flex flex-col gap-2">
							<a
								href="mailto:knowledgesquare.woodyprieb@gmail.com"
								class="link link-hover"
							>
								Email Us
							</a>
							<div class="flex gap-2">
								<a
									href="https://line.me/R/ti/p/%401234567890"
									class="link link-hover"
								>
									<i class="fab fa-line text-2xl text-green-600"></i>
								</a>
								<a
									href="https://www.facebook.com/profile.php?id=1000889188889188889"
									class="link link-hover"
								>
									<i class="fab fa-facebook text-2xl text-blue-600"></i>
								</a>
							</div>
						</div>
					</nav>
				</div>
			</div>
		</footer>
		<footer
			class="footer px-10 py-4 border-t border-base-300 max-w-[1440px] mx-auto"
		>
			<aside class="">
				<p>© {{ currentYear }} By Woody Prieb. All rights reserved.</p>
			</aside>
		</footer>
	</div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const currentYear = new Date().getFullYear();

const navigateTo = (path) => {
	router.push(path);
};
</script>
