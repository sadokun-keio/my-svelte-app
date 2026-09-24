<script lang="ts">
	let { data } = $props();
	const post = $derived(data.post);
</script>

<svelte:head>
	<title>{post.title} | Blog</title>
	{#if post.description}<meta name="description" content={post.description} />{/if}
</svelte:head>

<div class="container">
	<article class="content">
		<a class="back" href="/blog">← Blog一覧</a>
		<h1>{post.title}</h1>
		<p class="meta">{post.date}{#each post.tags as t}<em>#{t}</em>{/each}</p>
		<div class="md">{@html post.html}</div>
	</article>
</div>

<style>
	.back { color: #8ca0c9; text-decoration: none; }
	.meta { opacity: 0.7; font-size: 0.9rem; }
	.meta em { font-style: normal; margin-left: 0.6rem; color: #8ca0c9; }
	.md { line-height: 1.9; text-align: left; }
	.md :global(p), .md :global(li) { font-size: 1rem; color: #334; margin: 0.6rem 0; }
	.md :global(ul) { list-style: disc; padding-left: 1.6rem; }
	.md :global(ol) { list-style: decimal; padding-left: 1.6rem; }
	.md :global(li) { margin: 0.2rem 0; }
	.md :global(img) { max-width: 100%; border-radius: 8px; }
	.md :global(pre) { background: rgba(0, 0, 0, 0.3); padding: 1rem; border-radius: 8px; overflow-x: auto; }
	.md :global(a) { color: #8ca0c9; }
	.md :global(blockquote) { border-left: 4px solid #8ca0c9; margin: 0; padding-left: 1rem; opacity: 0.85; }
</style>
