<script lang="ts">
	import { onMount } from 'svelte';

	type P = { slug: string; title: string; date: string; tags: string[]; description: string; draft: boolean; publishAt: string; body: string };
	type Mode = 'public' | 'private' | 'scheduled';
	const today = () => new Date().toLocaleDateString('sv-SE');
	const blank = (): P => ({ slug: '', title: '', date: today(), tags: [], description: '', draft: false, publishAt: '', body: '' });
	// datetime-local <-> JST ISO
	const toLocal = (iso: string) => (iso ? new Date(Date.parse(iso) + 9 * 3600e3).toISOString().slice(0, 16) : '');
	const fromLocal = (v: string) => (v ? v + ':00+09:00' : '');
	const modeOf = (p: P): Mode => (p.draft ? 'private' : p.publishAt && Date.parse(p.publishAt) > Date.now() ? 'scheduled' : 'public');
	const modeLabel = { public: '', private: ' ・非公開', scheduled: ' ・予約' };

	let posts = $state<P[]>([]);
	let cur = $state<P>(blank());
	let oldSlug = $state('');
	let tagText = $state('');
	let preview = $state('');
	let status = $state('');
	let dirty = $state(false);
	let mode = $state<Mode>('public');
	let schedule = $state('');
	let textarea: HTMLTextAreaElement;
	let timer: ReturnType<typeof setTimeout>;

	async function refresh() { posts = await (await fetch('/admin/api/posts')).json(); }
	onMount(refresh);

	function open(p: P) {
		if (dirty && !confirm('保存していない変更があります。破棄しますか？')) return;
		cur = { ...p }; oldSlug = p.slug; mode = p.draft ? 'private' : p.publishAt ? 'scheduled' : 'public'; schedule = toLocal(p.publishAt); tagText = p.tags.join(', '); dirty = false; renderPreview();
	}
	function newPost() { open(blank()); oldSlug = ''; }

	function changed() { dirty = true; clearTimeout(timer); timer = setTimeout(renderPreview, 250); }
	async function renderPreview() {
		const r = await fetch('/admin/api/preview', { method: 'POST', body: JSON.stringify({ body: cur.body }) });
		preview = (await r.json()).html;
	}

	async function save() {
		cur.tags = tagText.split(',').map((t) => t.trim()).filter(Boolean);
		if (!cur.title) return (status = '⚠ タイトルを入力してください');
		if (!cur.slug) return (status = '⚠ URL名（slug）を入力してください');
		if (mode === 'scheduled' && !schedule) return (status = '⚠ 予約日時を入力してください');
		cur.draft = mode === 'private';
		cur.publishAt = mode === 'scheduled' ? fromLocal(schedule) : '';
		if (mode === 'scheduled') cur.date = schedule.slice(0, 10);
		const r = await fetch('/admin/api/posts', { method: 'POST', body: JSON.stringify({ ...cur, oldSlug }) });
		if (!r.ok) return (status = '⚠ ' + (await r.json()).message);
		const { slug } = await r.json();
		cur.slug = slug; oldSlug = slug; dirty = false;
		status = mode === 'scheduled' ? `✓ 保存しました（公開ボタンを押すと ${schedule.replace('T', ' ')} に自動公開）` : mode === 'private' ? '✓ 保存しました（非公開：公開ボタンでサイトから非表示）' : '✓ 保存しました（まだ公開されていません）';
		await refresh();
	}

	async function remove() {
		if (!oldSlug || !confirm(`「${cur.title}」を削除しますか？`)) return;
		await fetch('/admin/api/posts?slug=' + oldSlug, { method: 'DELETE' });
		dirty = false; newPost(); await refresh(); status = '削除しました（公開ボタンで反映）';
	}

	async function publish() {
		if (dirty) await save();
		if (!confirm('GitHubにpushしてサイトに公開しますか？')) return;
		status = '公開中…';
		const r = await fetch('/admin/api/publish', { method: 'POST', body: JSON.stringify({ message: `blog: ${cur.title || 'update posts'}` }) });
		const j = await r.json();
		status = (j.ok ? '🚀 ' : '⚠ ') + j.log;
	}

	// execCommand keeps the browser's native undo stack, so ⌘Z / ⇧⌘Z work
	function insert(text: string) {
		textarea.focus();
		if (!document.execCommand('insertText', false, text)) {
			textarea.setRangeText(text, textarea.selectionStart, textarea.selectionEnd, 'end');
			textarea.dispatchEvent(new Event('input', { bubbles: true }));
		}
	}
	// 選択範囲の各行の先頭に記号を付ける（未選択なら新しい行を作る）
	function prefixLines(mark: string) {
		const s = textarea.selectionStart, e = textarea.selectionEnd;
		if (s === e) return insert((s > 0 && cur.body[s - 1] !== '\n' ? '\n' : '') + mark);
		const ls = cur.body.lastIndexOf('\n', s - 1) + 1;
		const le = cur.body.endsWith('\n', e) && e > s ? e - 1 : e;
		const lines = cur.body.slice(ls, le).split('\n');
		const out = lines.map((l) => (l.trim() ? mark + l.replace(/^(\s*)([-*+]|>)\s+/, '$1') : l)).join('\n');
		textarea.setSelectionRange(ls, le);
		insert(out);
		textarea.setSelectionRange(ls, ls + out.length);
	}
	// 選択範囲（なければカーソル行）を配置ブロックで囲む。既存の配置ブロックは付け替え
	function align(kind: 'left' | 'center' | 'right' | 'span') {
		let s = textarea.selectionStart, e = textarea.selectionEnd;
		const b = cur.body;
		if (s === e) { s = b.lastIndexOf('\n', s - 1) + 1; const n = b.indexOf('\n', e); e = n < 0 ? b.length : n; }
		let inner = b.slice(s, e).trim();
		const m = inner.match(/^<div class="align-\w+">\s*([\s\S]*?)\s*<\/div>$/);
		if (m) inner = m[1];
		const before = s > 0 && b[s - 1] !== '\n' ? '\n\n' : s > 1 && b[s - 2] !== '\n' ? '\n' : '';
		const out = kind === 'left' ? inner : `${before}<div class="align-${kind}">\n\n${inner || 'テキスト'}\n\n</div>\n`;
		textarea.focus();
		textarea.setSelectionRange(s, e);
		insert(out);
	}
	function wrap(a: string, b = a) {
		const s = textarea.selectionStart, e = textarea.selectionEnd;
		insert(a + (cur.body.slice(s, e) || 'テキスト') + b);
	}

	async function upload(files: FileList | File[] | null | undefined) {
		for (const f of Array.from(files || [])) {
			if (!f.type.startsWith('image/')) continue;
			status = 'アップロード中…';
			const fd = new FormData(); fd.append('file', f);
			const r = await fetch('/admin/api/upload', { method: 'POST', body: fd });
			if (r.ok) { insert(`\n![${f.name}](${(await r.json()).url})\n`); status = '✓ 画像を挿入しました'; }
			else status = '⚠ アップロード失敗';
		}
	}

	function autoSlug() {
		if (!cur.slug) cur.slug = `${cur.date}-post`;
	}

	function onKey(e: KeyboardEvent) {
		if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); save(); }
	}
</script>

<svelte:window onkeydown={onKey} onbeforeunload={(e) => { if (dirty) e.preventDefault(); }} />
<svelte:head><title>Blog 管理画面</title></svelte:head>

<div class="admin">
	<aside>
		<button class="primary" onclick={newPost}>＋ 新しい記事</button>
		<ul>
			{#each posts as p}
				<li><button class:active={p.slug === oldSlug} onclick={() => open(p)}>
					<b>{p.title}</b><small>{p.date}{modeLabel[modeOf(p)]}</small>
				</button></li>
			{:else}<li class="empty">記事はまだありません</li>{/each}
		</ul>
		<button class="publish" onclick={publish}>🚀 サイトに公開</button>
	</aside>

	<main>
		<div class="fields">
			<input class="title" placeholder="タイトル" bind:value={cur.title} oninput={changed} />
			<div class="row">
				<label>日付 <input type="date" bind:value={cur.date} oninput={changed} /></label>
				<label>URL名 <input placeholder="my-first-post" bind:value={cur.slug} onfocus={autoSlug} oninput={changed} /></label>
				<label>タグ <input placeholder="日記, 大学" bind:value={tagText} oninput={changed} /></label>
				<label>公開設定
					<select bind:value={mode} onchange={changed}>
						<option value="public">公開</option>
						<option value="private">非公開</option>
						<option value="scheduled">予約投稿</option>
					</select>
				</label>
				{#if mode === 'scheduled'}<label>公開日時 <input type="datetime-local" bind:value={schedule} oninput={changed} /></label>{/if}
			</div>
			<input placeholder="概要（一覧に表示される一文）" bind:value={cur.description} oninput={changed} />
		</div>

		<div class="toolbar">
			<button onclick={() => insert('\n## ')}>見出し</button>
			<button onclick={() => wrap('**')}><b>B</b></button>
			<button onclick={() => wrap('*')}><i>I</i></button>
			<button onclick={() => wrap('[', '](https://)')}>リンク</button>
			<button onclick={() => prefixLines('- ')}>リスト</button>
			<button onclick={() => prefixLines('> ')}>引用</button>
			<button onclick={() => wrap('\n```\n', '\n```\n')}>コード</button>
			<span class="sep"></span>
			<button title="左揃え（配置を解除）" onclick={() => align('left')}>⯇ 左</button>
			<button title="中央揃え" onclick={() => align('center')}>中央</button>
			<button title="右揃え" onclick={() => align('right')}>右 ⯈</button>
			<button title="両端揃え・画像は横幅いっぱい" onclick={() => align('span')}>⇔ スパン</button>
			<label class="btn">🖼 画像<input type="file" accept="image/*" multiple hidden onchange={(e) => upload(e.currentTarget.files)} /></label>
			<span class="spacer"></span>
			{#if oldSlug}<button class="danger" onclick={remove}>削除</button>{/if}
			<button class="primary" onclick={save}>保存 (⌘S)</button>
		</div>

		<div class="editor">
			<textarea bind:this={textarea} bind:value={cur.body} oninput={changed}
				placeholder="Markdownで本文を書きます。画像はドラッグ＆ドロップ / ペーストでも挿入できます。"
				ondrop={(e) => { e.preventDefault(); upload(e.dataTransfer?.files); }}
				ondragover={(e) => e.preventDefault()}
				onpaste={(e) => { const f = e.clipboardData?.files; if (f?.length) { e.preventDefault(); upload(f); } }}
			></textarea>
			<div class="preview md">
				{#if cur.title}<h1>{cur.title}</h1>{/if}
				{@html preview}
			</div>
		</div>
		<p class="status">{dirty ? '● 未保存の変更あり　' : ''}{status}</p>
	</main>
</div>

<style>
	.admin { width: 100%; max-width: 100%; align-self: stretch; display: grid; grid-template-columns: 240px minmax(0, 1fr); gap: 1rem; padding: 1rem; height: calc(100vh - 80px); box-sizing: border-box; color: #334; text-align: left; }
	aside { display: flex; flex-direction: column; gap: 0.5rem; min-height: 0; }
	aside ul { list-style: none; padding: 0; margin: 0; overflow-y: auto; flex: 1; }
	aside li button { width: 100%; text-align: left; display: grid; padding: 0.5rem 0.7rem; margin-bottom: 4px; }
	aside li button.active { background: rgba(140, 160, 201, 0.4); }
	aside small { opacity: 0.6; }
	.empty { opacity: 0.6; padding: 0.5rem; }
	main { min-width: 0; display: flex; flex-direction: column; gap: 0.5rem; min-height: 0; }
	.fields { display: grid; gap: 0.5rem; }
	.row { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
	.row label { display: flex; gap: 0.3rem; align-items: center; font-size: 0.85rem; }
	input:not([type='checkbox']), select, textarea { background: #fff; color: inherit; border: 1px solid rgba(140, 160, 201, 0.35); border-radius: 8px; padding: 0.45rem 0.6rem; font: inherit; }
	input.title { font-size: 1.4rem; font-weight: 700; }
	.toolbar { display: flex; gap: 0.35rem; flex-wrap: wrap; }
	.spacer { flex: 1; }
	.sep { width: 1px; background: rgba(140, 160, 201, 0.35); margin: 0 0.2rem; }
	button, .btn { background: rgba(140, 160, 201, 0.15); color: inherit; border: 1px solid rgba(140, 160, 201, 0.35); border-radius: 8px; padding: 0.35rem 0.75rem; cursor: pointer; font: inherit; font-size: 0.9rem; }
	button:hover, .btn:hover { background: rgba(140, 160, 201, 0.3); }
	.primary { background: #8ca0c9; color: #111; font-weight: 700; }
	.publish { background: #4caf7a; color: #fff; font-weight: 700; padding: 0.6rem; }
	.danger { border-color: #d66; color: #f99; }
	.editor { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 0.75rem; flex: 1; min-height: 0; }
	textarea { width: 100%; min-width: 0; white-space: pre-wrap; overflow-wrap: anywhere; overflow-x: hidden; resize: none; font-family: ui-monospace, Menlo, monospace; font-size: 0.95rem; line-height: 1.7; height: 100%; box-sizing: border-box; }
	.preview { min-width: 0; overflow-wrap: anywhere; overflow-y: auto; padding: 0 1rem; border: 1px solid rgba(140, 160, 201, 0.2); border-radius: 8px; line-height: 1.9; }
	.preview :global(p), .preview :global(li) { font-size: 1rem; color: #334; margin: 0.6rem 0; }
	.preview :global(ul) { list-style: disc; padding-left: 1.6rem; }
	.preview :global(ol) { list-style: decimal; padding-left: 1.6rem; }
	.preview :global(li) { margin: 0.2rem 0; }
	.preview :global(img) { max-width: 100%; border-radius: 8px; }
	.preview :global(pre) { background: rgba(0, 0, 0, 0.3); padding: 1rem; border-radius: 8px; overflow-x: auto; }
	.preview :global(blockquote) { border-left: 4px solid #8ca0c9; margin: 0; padding-left: 1rem; opacity: 0.85; }
	.status { margin: 0; font-size: 0.85rem; opacity: 0.85; white-space: pre-wrap; }
	@media (max-width: 800px) { .admin { grid-template-columns: 1fr; height: auto; } .editor { grid-template-columns: 1fr; } textarea { min-height: 50vh; } }
</style>
