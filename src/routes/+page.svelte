<script lang="ts">
	import { onMount } from 'svelte';
	import { goto, preloadData } from '$app/navigation';
	import { page } from '$app/stores';
	import portraitImage from '$lib/images/portrait.jpg';

	let loading = $state(true);
	let loadingProgress = $state(0);
	let loadingInterval: ReturnType<typeof setInterval> | null = null;
	const portrait = portraitImage; // インポートした画像を使用

	// ソーシャルメディアリンク
	const socialLinks = [
		{
			name: 'X (Twitter)',
			icon: 'https://upload.wikimedia.org/wikipedia/commons/5/57/X_logo_2023_%28white%29.png',
			url: 'https://x.com/sfcnosadokun'
		},
		{
			name: 'Instagram',
			icon: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg',
			url: 'https://instagram.com/nanairo_naive_'
		},
		{
			name: 'LinkedIn',
			icon: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
			url: 'https://linkedin.com/in/ryunosukesado'
		},
		{
			name: 'Pixiv',
			icon: 'https://cdn.brandfetch.io/idIlKj_n7C/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B',
			url: 'https://pixiv.net/users/your_userid'
		},
		{
			name: 'GitHub',
			icon: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
			url: 'https://github.com/sadokun-keio'
		}
	];

	onMount(() => {
		const init = async () => {
			// ページが直接アクセスされた場合のみローディングを表示
			if ($page.url.pathname === '/') {
				// プリロードするルート
				const routes = ['/career', '/about-me', '/works', '/blog', '/fun'];

				// ロード進捗のシミュレーション
				loadingInterval = setInterval(() => {
					if (loadingProgress < 90) {
						loadingProgress += 5;
					}
				}, 200);

				// すべてのルートをプリロード
				try {
					await Promise.all(routes.map((route) => preloadData(route)));
					// プリロードが完了したら100%に
					loadingProgress = 100;

					// 少し待ってからローディング表示を消す
					setTimeout(() => {
						if (loadingInterval) clearInterval(loadingInterval);
						loading = false;
					}, 500);
				} catch (error) {
					console.error('プリロードエラー:', error);
					// エラーが発生しても、ユーザーにページを表示
					loadingProgress = 100;
					if (loadingInterval) clearInterval(loadingInterval);
					loading = false;
				}
			} else {
				// 他のページから遷移した場合はローディングを表示しない
				loading = false;
			}
		};

		init();

		return () => {
			if (loadingInterval) {
				clearInterval(loadingInterval);
			}
		};
	});

	function navigateToAboutMe() {
		goto('/about-me');
	}
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;400;500;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="container">
	{#if loading}
		<div class="loading">
			<div class="spinner"></div>
			<p>読み込み中...{loadingProgress}%</p>
			<div class="progress-bar">
				<div class="progress" style="width: {loadingProgress}%"></div>
			</div>
		</div>
	{:else}
		<div class="content">
			<section class="hero">
				<div class="portrait">
					<img src={portrait} alt="佐渡 隆之介のポートレート" />
				</div>
				<div class="hero-text">
					<h1>sadokun.blueへようこそ！</h1>
					<p>
						ここは佐渡 隆之介(さど りゅうのすけ)/さどくんの個人WEBSITEです。名刺をタップした方は、
						<button class="inline-link" onclick={navigateToAboutMe}>このページ</button>
						を訪れていただくと僕について詳しく知ることができます。
					</p>
				</div>
			</section>

			<section class="brief-intro">
				<h3>一行で自己紹介</h3>
				<p>ゲームと水色かわいいが好きな大学生です！</p>
			</section>

			<section class="social">
				<h2>Contacts and Social Media</h2>
				<div class="social-icons">
					{#each socialLinks as link}
						<a href={link.url} target="_blank" rel="noopener noreferrer" class="social-icon">
							<img src={link.icon} alt={link.name} />
						</a>
					{/each}
				</div>
			</section>
		</div>
	{/if}
</div>

<style>
	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		width: 100%;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		background-color: white;
		z-index: 1000;
		box-sizing: border-box;
	}

	.spinner {
		width: 60px;
		height: 60px;
		border: 8px solid rgba(197, 208, 233, 0.3);
		border-radius: 50%;
		border-top-color: #8ca0c9;
		animation: spin 1s ease-in-out infinite;
		margin-bottom: 1rem;
	}

	.progress-bar {
		width: 80%;
		max-width: 300px;
		height: 10px;
		background-color: #dcdae7;
		border-radius: 5px;
		margin-top: 1rem;
		overflow: hidden;
	}

	.progress {
		height: 100%;
		background-color: #8ca0c9; /* Seraph Blue */
		border-radius: 5px;
		transition: width 0.3s ease;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.hero {
		display: flex;
		align-items: center;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	@media (max-width: 768px) {
		.hero {
			flex-direction: column;
			gap: 1rem;
		}

		.loading {
			padding: 1rem;
		}

		.spinner {
			width: 40px;
			height: 40px;
			border-width: 5px;
		}

		.progress-bar {
			width: 80%;
			max-width: 240px;
		}
	}

	.portrait {
		flex: 1;
		min-width: 200px;
		display: flex;
		justify-content: center;
	}

	.portrait img {
		width: 100%;
		max-width: 300px;
		border-radius: 10px;
		box-shadow: 0 5px 15px rgba(140, 160, 201, 0.3);
		object-fit: cover;
	}

	.hero-text {
		flex: 2;
		text-align: left;
	}

	.brief-intro {
		margin: 2rem 0;
		padding: 1.5rem;
		background-color: #dcdae7; /* Mist Lavender */
		border-radius: 10px;
	}

	.social {
		margin-top: 2rem;
	}

	.social-icons {
		display: flex;
		justify-content: center;
		gap: 1.5rem;
		margin-top: 1rem;
		flex-wrap: wrap;
	}

	.social-icon {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: #c5d0e9;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition:
			transform 0.3s ease,
			background-color 0.3s ease;
		text-decoration: none;
	}

	.social-icon:hover {
		transform: translateY(-5px);
		background-color: #a8bade;
	}

	.social-icon img {
		width: 24px;
		height: 24px;
		object-fit: contain;
	}

	.inline-link {
		background: none;
		border: none;
		padding: 0;
		color: #a8bade; /* Dream Blue */
		font-weight: bold;
		text-decoration: underline;
		cursor: pointer;
		font-size: inherit;
	}

	.inline-link:hover {
		color: #9b6e91; /* Halo Mauve */
	}
</style>
