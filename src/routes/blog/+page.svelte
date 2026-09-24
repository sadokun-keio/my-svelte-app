<script lang="ts">
	let { data } = $props();
</script>

<svelte:head><title>Blog</title></svelte:head>

<div class="container">
	<div class="content">
		<h1>Blog</h1>
		{#if data.posts.length === 0}
			<p>まだ記事がありません。</p>
		{:else}
			<ul class="posts">
				{#each data.posts as post}
					<li>
						<a href="/blog/{post.slug}">
							<span class="date">{post.date}</span>
							<span class="title">{post.title}</span>
							{#if post.description}<span class="desc">{post.description}</span>{/if}
							{#if post.tags.length}<span class="tags">{#each post.tags as t}<em>#{t}</em>{/each}</span>{/if}
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style>
	.posts { list-style: none; padding: 0; display: grid; gap: 1rem; }
	.posts a { display: grid; gap: 0.25rem; padding: 1rem 1.25rem; border-radius: 12px; background: rgba(140, 160, 201, 0.12); text-decoration: none; color: inherit; transition: background 0.2s; }
	.posts a:hover { background: rgba(140, 160, 201, 0.25); }
	.date { font-size: 0.85rem; opacity: 0.7; }
	.title { font-size: 1.2rem; font-weight: 700; }
	.desc { opacity: 0.85; }
	.tags em { font-style: normal; font-size: 0.8rem; margin-right: 0.5rem; color: #8ca0c9; }
</style>
