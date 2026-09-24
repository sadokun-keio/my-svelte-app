import { json, error } from '@sveltejs/kit';
import fs from 'node:fs/promises';
import path from 'node:path';
import { guard, IMG_DIR } from '$lib/server/admin';
export const prerender = false;
export async function POST({ request }) {
	guard();
	const form = await request.formData();
	const file = form.get('file');
	if (!(file instanceof File)) error(400, 'no file');
	const ext = (path.extname(file.name) || '.png').toLowerCase();
	if (!['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif'].includes(ext)) error(400, '画像ファイルのみ');
	const base = path.basename(file.name, path.extname(file.name)).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'image';
	const name = `${Date.now()}-${base}${ext}`;
	await fs.mkdir(IMG_DIR, { recursive: true });
	await fs.writeFile(path.join(IMG_DIR, name), Buffer.from(await file.arrayBuffer()));
	return json({ url: `/blog/${name}` });
}
