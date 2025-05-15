<script>
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { page } from '$app/stores';

	injectSpeedInsights();
	injectAnalytics();

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
		cloudWhite: '#FFFFFF',   // Cloud White - Main background, card inner-fill
		mistLavender: '#DCDAE7', // Mist Lavender - Section Background, subtle dividers
		angelicLilac: '#C5D0E9', // Angelic Lilac - Secondary Buttons, tabs
		dreamBlue: '#A8BADE',    // Dream Blue - Primary action Hover, links
		seraphBlue: '#8CA0C9',   // Seraph Blue - Primary buttons - default
		twiliteSlate: '#6C7294', // Twilite Slate - Body text, icons, borders
		haloMauve: '#9B6E91',    // Halo Mauve - Accents like badges, reminders
		abyssBlack: '#2D2F36'    // Abyss Black - High-contrast text, dark-mode background
	};
</script>

<svelte:head>
	<link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;400;500;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="app">
	<header>
		<nav>
			<ul>
				{#each navItems as item}
					<li>
						<a 
							href={item.url} 
							class:active={$page.url.pathname === item.url}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</header>
	
	<main>
		<slot />
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background: #FFFFFF; /* Cloud White */
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
		border-bottom: 1px solid #DCDAE7; /* Mist Lavender */
		padding: 0.5rem 2rem;
	}

	nav ul {
		display: flex;
		justify-content: center;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	nav li {
		margin: 0 1rem;
	}

	nav a {
		display: block;
		padding: 0.75rem 1rem;
		color: #6C7294; /* Twilite Slate */
		text-decoration: none;
		font-weight: 500;
		border-radius: 8px;
		transition: all 0.3s ease;
	}

	nav a:hover {
		color: #A8BADE; /* Dream Blue */
		transform: translateY(-2px);
	}

	nav a.active {
		color: #8CA0C9; /* Seraph Blue */
		background-color: #C5D0E9; /* Angelic Lilac */
	}

	main {
		flex: 1;
		padding-top: 70px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* 共通スタイル */
	:global(.container) {
		text-align: center;
		background-color: #FFFFFF; /* Cloud White */
		border-radius: 20px;
		padding: 2rem;
		box-shadow: 0 8px 32px rgba(140, 160, 201, 0.2); /* Seraph Blue with transparency */
		max-width: 80%;
		margin: 2rem auto;
		border: 1px solid #DCDAE7; /* Mist Lavender */
	}
	
	:global(h1) {
		color: #8CA0C9; /* Seraph Blue */
		font-size: 2.5rem;
		margin-bottom: 1rem;
	}
	
	:global(p) {
		color: #6C7294; /* Twilite Slate */
		font-size: 1.2rem;
		margin: 0.5rem 0;
	}

	:global(.content) {
		animation: fadeIn 0.5s ease-in;
	}
	
	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}
</style>