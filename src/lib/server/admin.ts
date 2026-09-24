import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';
import path from 'node:path';
export const ROOT = process.cwd();
export const POSTS_DIR = path.join(ROOT, 'src/posts');
export const IMG_DIR = path.join(ROOT, 'static/blog');
export function guard() { if (!dev) error(404, 'Not found'); }
export function safeSlug(s: string) {
	const slug = String(s || '').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
	if (!slug) error(400, 'slugは半角英数字とハイフンで指定してください');
	return slug;
}
