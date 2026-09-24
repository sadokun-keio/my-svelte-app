import { json } from '@sveltejs/kit';
import { pendingPosts } from '$lib/posts';
// ビルド時点の予約待ち記事。GitHub Actions がこれを見て、時刻を過ぎたら再デプロイする
export const prerender = true;
export const GET = () => json({ builtAt: new Date().toISOString(), pending: pendingPosts().map((p) => ({ slug: p.slug, publishAt: p.publishAt })) });
