<script>
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	let { children } = $props();

	injectSpeedInsights();
	injectAnalytics();

	let isMobileMenuOpen = $state(false);
	let isMobile = $state(false);

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	onMount(() => {
		const checkIfMobile = () => {
			isMobile = window.innerWidth < 768;
		};

		checkIfMobile();
		window.addEventListener('resize', checkIfMobile);

		return () => {
			window.removeEventListener('resize', checkIfMobile);
		};
	});

	const navItems = [
		{ url: '/', label: 'Home' },
		{ url: '/career', label: 'Career' },
		{ url: '/about-me', label: 'About Me' },
		{ url: '/works', label: 'Works' },
		{ url: '/blog', label: 'Blog' },
		{ url: '/fun', label: 'Fun' }
	];

	// カラーパレットの定義
	const colors = {
		cloudWhite: '#FFFFFF', // Cloud White - Main background, card inner-fill
		mistLavender: '#DCDAE7', // Mist Lavender - Section Background, subtle dividers
		angelicLilac: '#C5D0E9', // Angelic Lilac - Secondary Buttons, tabs
		dreamBlue: '#A8BADE', // Dream Blue - Primary action Hover, links
		seraphBlue: '#8CA0C9', // Seraph Blue - Primary buttons - default
		twiliteSlate: '#6C7294', // Twilite Slate - Body text, icons, borders
		haloMauve: '#9B6E91', // Halo Mauve - Accents like badges, reminders
		abyssBlack: '#2D2F36' // Abyss Black - High-contrast text, dark-mode background
	};
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;400;500;700&display=swap"
		rel="stylesheet"
	/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="app">
	<header>
		<nav>
			{#if isMobile}
				<div class="mobile-nav">
					<button class="hamburger" onclick={toggleMobileMenu} aria-label="Toggle mobile menu">
						<span></span>
						<span></span>
						<span></span>
					</button>
					{#if isMobileMenuOpen}
						<div class="mobile-menu" transition:slide={{ duration: 300 }}>
							<ul>
								{#each navItems as item}
									<li>
										<a
											href={item.url}
											class:active={$page.url.pathname === item.url}
											onclick={() => (isMobileMenuOpen = false)}
										>
											{item.label}
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			{:else}
				<ul class="desktop-menu">
					{#each navItems as item}
						<li>
							<a href={item.url} class:active={$page.url.pathname === item.url}>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</nav>
	</header>

	<main>
		{@render children()}
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background: #ffffff; /* Cloud White */
		font-family: 'M PLUS Rounded 1c', sans-serif;
		min-height: 100vh;
	}

	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 10;
		backdrop-filter: blur(8px);
		background-color: rgba(255, 255, 255, 0.7);
		border-bottom: 1px solid #dcdae7; /* Mist Lavender */
		padding: 0.5rem 1rem;
	}

	nav {
		width: 100%;
	}

	.desktop-menu {
		display: flex;
		justify-content: center;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.desktop-menu li {
		margin: 0 0.75rem;
	}

	.mobile-nav {
		display: flex;
		justify-content: flex-end;
	}

	.hamburger {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		width: 2rem;
		height: 2rem;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		z-index: 10;
	}

	.hamburger span {
		width: 2rem;
		height: 0.25rem;
		background: #6c7294; /* Twilite Slate */
		border-radius: 0.5rem;
		transition: all 0.3s linear;
		position: relative;
		transform-origin: 1px;
	}

	.mobile-menu {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background-color: rgba(255, 255, 255, 0.95);
		padding: 1rem;
		box-shadow: 0 4px 6px rgba(140, 160, 201, 0.1);
	}

	.mobile-menu ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
	}

	.mobile-menu li {
		margin: 0.5rem 0;
	}

	nav a {
		display: block;
		padding: 0.5rem 0.75rem;
		color: #6c7294; /* Twilite Slate */
		text-decoration: none;
		font-weight: 500;
		border-radius: 8px;
		transition: all 0.3s ease;
		text-align: center;
	}

	nav a:hover {
		color: #a8bade; /* Dream Blue */
		transform: translateY(-2px);
	}

	nav a.active {
		color: #8ca0c9; /* Seraph Blue */
		background-color: #c5d0e9; /* Angelic Lilac */
	}

	main {
		flex: 1;
		padding-top: 60px;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}

	/* 共通スタイル */
	:global(.container) {
		text-align: center;
		background-color: #ffffff; /* Cloud White */
		border-radius: 20px;
		padding: 2rem;
		box-shadow: 0 8px 32px rgba(140, 160, 201, 0.2); /* Seraph Blue with transparency */
		max-width: 90%;
		margin: 1rem auto;
		border: 1px solid #dcdae7; /* Mist Lavender */
	}

	@media (max-width: 768px) {
		:global(.container) {
			padding: 1.5rem;
			margin: 0.75rem auto;
		}
	}

	:global(h1) {
		color: #8ca0c9; /* Seraph Blue */
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}

	:global(h2) {
		color: #8ca0c9; /* Seraph Blue */
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	:global(h3) {
		color: #6c7294; /* Twilite Slate */
		font-size: 1.5rem;
		margin-bottom: 0.75rem;
	}

	:global(p) {
		color: #6c7294; /* Twilite Slate */
		font-size: 1.2rem;
		margin: 0.5rem 0;
	}

	:global(.content) {
		animation: fadeIn 0.5s ease-in;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@media (max-width: 768px) {
		:global(h1) {
			font-size: 2rem;
		}

		:global(h2) {
			font-size: 1.75rem;
		}

		:global(h3) {
			font-size: 1.25rem;
		}

		:global(p) {
			font-size: 1rem;
		}
	}
</style>
