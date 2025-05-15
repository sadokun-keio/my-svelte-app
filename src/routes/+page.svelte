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
      <h1>Home</h1>
      <p>ようこそ！このサイトは準備中です。</p>
      <p>もうしばらくお待ちください。</p>
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
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
