<template>
	<footer class="footer p-10 bg-base-200 text-base-content">
		<div
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 container mx-auto px-4"
		>
			<aside>
				<h2 class="text-2xl font-bold text-primary">B-Commerce</h2>
				<p>
					Your Trusted Shopping Destination<br />Providing reliable products
					since 2024
				</p>
			</aside>
			<nav>
				<header class="footer-title">Services</header>
				<router-link to="/products" class="link link-hover"
					>Products</router-link
				>
				<router-link to="/new-arrivals" class="link link-hover"
					>New Arrivals</router-link
				>
				<router-link to="/best-sellers" class="link link-hover"
					>Best Sellers</router-link
				>
				<router-link to="/deals" class="link link-hover"
					>Special Deals</router-link
				>
			</nav>
			<nav>
				<header class="footer-title">Company</header>
				<router-link to="/about" class="link link-hover">About us</router-link>
				<router-link to="/contact" class="link link-hover">Contact</router-link>
				<router-link to="/careers" class="link link-hover">Careers</router-link>
				<router-link to="/press" class="link link-hover">Press kit</router-link>
			</nav>
			<nav>
				<header class="footer-title">Legal</header>
				<router-link to="/terms" class="link link-hover"
					>Terms of use</router-link
				>
				<router-link to="/privacy" class="link link-hover"
					>Privacy policy</router-link
				>
				<router-link to="/cookie" class="link link-hover"
					>Cookie policy</router-link
				>
			</nav>
		</div>
	</footer>
	<footer
		class="footer px-10 py-4 border-t bg-base-200 text-base-content border-base-300"
	>
		<aside class="items-center grid-flow-col">
			<p>© 2024 B-Commerce. All rights reserved.</p>
		</aside>
		<nav class="md:place-self-center md:justify-self-end">
			<div class="grid grid-flow-col gap-4">
				<a href="#" class="hover:text-primary">
					<i class="fab fa-twitter text-xl"></i>
				</a>
				<a href="#" class="hover:text-primary">
					<i class="fab fa-youtube text-xl"></i>
				</a>
				<a href="#" class="hover:text-primary">
					<i class="fab fa-facebook text-xl"></i>
				</a>
				<a href="#" class="hover:text-primary">
					<i class="fab fa-instagram text-xl"></i>
				</a>
			</div>
		</nav>
	</footer>
</template>

<script setup>
// No additional logic needed for now
</script>
