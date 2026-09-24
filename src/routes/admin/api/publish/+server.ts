import { json } from '@sveltejs/kit';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { guard, ROOT } from '$lib/server/admin';
export const prerender = false;
const run = promisify(execFile);
const git = (...args: string[]) => run('git', args, { cwd: ROOT });

export async function POST({ request }) {
	guard();
	const { message } = await request.json().catch(() => ({}));
	try {
		await git('add', '-A', '--', 'src/posts', 'static/blog');
		const { stdout } = await git('diff', '--cached', '--name-only');
		if (!stdout.trim()) return json({ ok: true, log: '変更はありません（公開済み）' });
		await git('commit', '-m', message || 'blog: update posts');
		const push = await git('push');
		return json({ ok: true, log: `公開しました\n${stdout}${push.stderr}` });
	} catch (e: any) {
		return json({ ok: false, log: String(e.stderr || e.message) }, { status: 500 });
	}
}
