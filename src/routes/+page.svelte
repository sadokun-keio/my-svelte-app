<script>
  import { onMount } from 'svelte';
  
  let loading = true;
  
  onMount(() => {
    setTimeout(() => {
      loading = false;
    }, 2000);
  });
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;400;500;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="container">
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>読み込み中...</p>
    </div>
  {:else}
    <div class="content">
      <h1>ようこそ！</h1>
      <p>このサイトは現在準備中です。</p>
      <p>もうしばらくお待ちください。</p>
    </div>
  {/if}
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #e0ffff, #40e0d0);
    font-family: 'M PLUS Rounded 1c', sans-serif;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .container {
    text-align: center;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 255, 0.1);
    max-width: 80%;
    margin: 0 auto;
  }
  
  h1 {
    color: #0000ff;
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: #333;
    font-size: 1.2rem;
    margin: 0.5rem 0;
  }
  
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  
  .spinner {
    width: 60px;
    height: 60px;
    border: 8px solid rgba(64, 224, 208, 0.3);
    border-radius: 50%;
    border-top-color: #0000ff;
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .content {
    animation: fadeIn 0.5s ease-in;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
</style>
