import { json } from '@sveltejs/kit';
import fs from 'node:fs/promises';
import path from 'node:path';
import { guard, POSTS_DIR, safeSlug } from '$lib/server/admin';
import { toPost, serialize } from '$lib/posts';

export const prerender = false;

export async function GET() {
	guard();
	await fs.mkdir(POSTS_DIR, { recursive: true });
	const names = (await fs.readdir(POSTS_DIR)).filter((n) => n.endsWith('.md'));
	const posts = await Promise.all(names.map(async (n) => toPost(n.replace(/\.md$/, ''), await fs.readFile(path.join(POSTS_DIR, n), 'utf8'))));
	posts.sort((a, b) => b.date.localeCompare(a.date));
	return json(posts);
}

export async function POST({ request }) {
	guard();
	const p = await request.json();
	const slug = safeSlug(p.slug);
	await fs.mkdir(POSTS_DIR, { recursive: true });
	if (p.oldSlug && p.oldSlug !== slug) await fs.rm(path.join(POSTS_DIR, safeSlug(p.oldSlug) + '.md'), { force: true });
	await fs.writeFile(path.join(POSTS_DIR, slug + '.md'), serialize({ ...p, tags: p.tags || [] }));
	return json({ ok: true, slug });
}

export async function DELETE({ url }) {
	guard();
	await fs.rm(path.join(POSTS_DIR, safeSlug(url.searchParams.get('slug') || '') + '.md'), { force: true });
	return json({ ok: true });
}
