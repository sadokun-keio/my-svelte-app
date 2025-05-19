<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto, preloadData } from '$app/navigation';
  import { page } from '$app/stores';
  
  let loading = true;
  let loadingProgress = 0;
  let loadingInterval: ReturnType<typeof setInterval> | null = null;
  let portrait = '/images/portrait.jpg'; // ポートレート画像のパスを更新
  
  // ソーシャルメディアリンク
  const socialLinks = [
    { name: 'X (Twitter)', icon: '/icons/twitter.svg' },
    { name: 'Instagram', icon: '/icons/instagram.svg' },
    { name: 'LinkedIn', icon: '/icons/linkedin.svg' },
    { name: 'Pixiv', icon: '/icons/pixiv.svg' },
    { name: 'GitHub', icon: '/icons/github.svg' }
  ];
  
  onMount(async () => {
    // ページが直接アクセスされた場合のみローディングを表示
    if ($page.url.pathname === '/') {
      // プリロードするルート
      const routes = [
        '/career',
        '/about-me',
        '/works',
        '/blog',
        '/fun'
      ];
      
      // ロード進捗のシミュレーション
      loadingInterval = setInterval(() => {
        if (loadingProgress < 90) {
          loadingProgress += 5;
        }
      }, 200);
      
      // すべてのルートをプリロード
      try {
        await Promise.all(routes.map(route => preloadData(route)));
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
  });

  onDestroy(() => {
    if (loadingInterval) {
      clearInterval(loadingInterval);
    }
  });
  
  function navigateToAboutMe() {
    goto('/about-me');
  }
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;400;500;700&display=swap" rel="stylesheet">
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
            <button class="inline-link" on:click={navigateToAboutMe}>このページ</button>
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
            <div class="social-icon">
              <img src={link.icon} alt={link.name} />
            </div>
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
  }
  
  .spinner {
    width: 60px;
    height: 60px;
    border: 8px solid rgba(197, 208, 233, 0.3); /* Angelic Lilac with transparency */
    border-radius: 50%;
    border-top-color: #8CA0C9; /* Seraph Blue */
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 1rem;
  }
  
  .progress-bar {
    width: 80%;
    height: 10px;
    background-color: #DCDAE7; /* Mist Lavender */
    border-radius: 5px;
    margin-top: 1rem;
    overflow: hidden;
  }
  
  .progress {
    height: 100%;
    background-color: #8CA0C9; /* Seraph Blue */
    border-radius: 5px;
    transition: width 0.3s ease;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
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
  }
  
  .portrait {
    flex: 1;
    min-width: 200px;
  }
  
  .portrait img {
    width: 100%;
    max-width: 300px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(140, 160, 201, 0.3);
  }
  
  .hero-text {
    flex: 2;
    text-align: left;
  }
  
  .brief-intro {
    margin: 2rem 0;
    padding: 1.5rem;
    background-color: #DCDAE7; /* Mist Lavender */
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
    background-color: #C5D0E9; /* Angelic Lilac */
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.3s ease, background-color 0.3s ease;
  }
  
  .social-icon:hover {
    transform: translateY(-5px);
    background-color: #A8BADE; /* Dream Blue */
  }
  
  .social-icon img {
    width: 24px;
    height: 24px;
  }
  
  .inline-link {
    background: none;
    border: none;
    padding: 0;
    color: #A8BADE; /* Dream Blue */
    font-weight: bold;
    text-decoration: underline;
    cursor: pointer;
    font-size: inherit;
  }
  
  .inline-link:hover {
    color: #9B6E91; /* Halo Mauve */
  }
</style>
