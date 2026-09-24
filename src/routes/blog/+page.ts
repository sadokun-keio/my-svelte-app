import { getPosts, pendingPosts } from '$lib/posts';
// 予約待ちの記事がなければ静的生成。ある間だけアクセス時に描画して時刻どおりに一覧へ出す
export const prerender = pendingPosts().length === 0;
export const load = () => ({ posts: getPosts().map(({ html, body, ...m }) => m) });
